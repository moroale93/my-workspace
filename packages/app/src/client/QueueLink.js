import { ApolloLink } from '@apollo/client';
import { checkDocument, removeDirectivesFromDocument, hasDirectives, getOperationDefinition } from '@apollo/client/utilities';
import { Observable } from 'zen-observable-ts';
import GraphStore, { Action } from '@amoretto/action-graph';

const DIRECTIVE_NAME = 'queue';

function getDirectiveOptions(directiveName, { directives }) {
  if (!directives) {
    return {};
  }
  const directive = directives.find(({ name }) => name.value === directiveName);
  const args = directive
    ? directive.arguments.map(({ name, value }) => ({ [name.value]: value.value }))
    : [];
  return args.reduce((map, arg) => ({ ...map, ...arg }), {});
}

class QueueLink extends ApolloLink {
  constructor() {
    super();
    this.processedDocuments = new Map();
  }

  removeDirectiveFromDocument(query) {
    const cached = this.processedDocuments.get(query);
    if (cached) return cached;

    checkDocument(query);

    const docClone = removeDirectivesFromDocument([{
      name: DIRECTIVE_NAME,
      remove: true,
    }], query);

    this.processedDocuments.set(query, docClone);

    return docClone;
  }

  request(operation, forward) {
    const { query } = operation;
    const isQueuedQuery = hasDirectives([DIRECTIVE_NAME], query);

    // TODO  this is on for the rest, but if we want to evaluate its status it must pass trough the graph! even if it's an orphan node
    // this means that we need an annotation that point out this thing
    if (!isQueuedQuery) {
      return forward(operation);
    }

    const cleanedQuery = this.removeDirectiveFromDocument(query);
    operation.query = cleanedQuery;
    const { name } = getDirectiveOptions(DIRECTIVE_NAME, getOperationDefinition(query));

    return new Observable(observer => {
      const command = () => new Promise((resolve, reject) => {
        console.log('Start operation ', operation.operationName, operation.variables.input.text);

        forward(operation).subscribe({
          next: result => {
            console.log('Operation next', result, operation.operationName, operation.variables.input.text);
            resolve(result);
          },
          error: error => {
            console.log('Operation error', operation.operationName, operation.variables.input.text);
            reject(error);
          }, // TODO adapt this, otherwise on error it will block everything
        });
      });
      const action = new Action([name], [name], command);
      action.subject.subscribe({
        complete: () => observer.complete && observer.complete(),
        next: ({ error, result }) => {
          if (error && observer.error) {
            return observer.error(error);
          }
          if (result && observer.next) {
            return observer.next(result);
          }
        },
      });
      GraphStore.getInstance().getGraph('test').addNode(action);
      return () => {};
    });
  }
}

export default QueueLink;
