import { ApolloLink } from '@apollo/client';
import { checkDocument, removeDirectivesFromDocument, hasDirectives, getOperationDefinition } from '@apollo/client/utilities';
import { Observable } from 'zen-observable-ts';
import GraphStore, { Action } from '@amoretto/action-graph';
import GqlError from '../errors/gqlError.ts';
import _ from 'lodash';

const DIRECTIVE_NAME = 'action';

function transformValue(value, variables) {
  if (value.block === false) {
    return value.value;
  }
  if (value.fields[0].name.value === 'selector') {
    return _.get(variables, value.fields[0].value.value);
  }
}

function getDirectiveOptions(directiveName, { directives }, variables) {
  if (!directives) {
    return {};
  }
  const directive = directives.find(({ name }) => name.value === directiveName);
  const args = directive
    ? directive.arguments.map(({ name, value }) => ({
      [name.value]: value.values.map(value => transformValue(value, variables)),
    }))
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
    const { query, variables } = operation;
    const isQueryWithDependencies = hasDirectives([DIRECTIVE_NAME], query);

    if (!isQueryWithDependencies) {
      return forward(operation);
    }
    const cleanedQuery = this.removeDirectiveFromDocument(query);
    operation.query = cleanedQuery;
    const {
      tags,
      dependencies,
    } = getDirectiveOptions(DIRECTIVE_NAME, getOperationDefinition(query), variables);

    return new Observable(observer => {
      const command = () => new Promise((resolve, reject) => {
        forward(operation).subscribe({
          next: result => {
            if (result?.errors) {
              console.log("errors on GQL");
              reject(new GqlError(result));
              return;
            }
            resolve(result);
          },
          error: reject,
        });
      });
      const action = new Action(tags, dependencies, command);
      const subscription = action.subject.subscribe({
        error: error => {
          console.log('ERROR', error);
          observer.error(error);
        },
        complete: result => observer.complete && observer.complete(result),
        next: ({ error, result }) => {
          if (result?.errors) {
            console.log('ERROR ON THE QUERY\'S RESULT');
            return observer.next(result);
          }
          if (result && observer.next) {
            console.log('SUCCESS');
            return observer.next(result);
          }
          if (error instanceof GqlError) {
            console.log('NEW ERROR ON THE QUERY\'S RESULT');
            return observer.next(error.result);
          }
          if (error && observer.error) {
            console.log('GENERAL ERROR');
            return observer.error(error);
          }
        },
      });
      GraphStore.getInstance().getGraph('test').addNode(action);
      return () => {
        if (!subscription.closed) {
          subscription.unsubscribe();
        }
      };
    });
  }
}

export default QueueLink;
