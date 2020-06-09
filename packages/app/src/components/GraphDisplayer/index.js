import { useEffect, useState } from 'react';
import GraphStore, { ActionStore } from '@amoretto/action-graph';
import PropTypes from 'prop-types';

import renderGraph from './graph';

function getNodes(nodeDeleted) {
  let { actions } = ActionStore.getInstance();
  let removedId;
  if (nodeDeleted) {
    removedId = actions[nodeDeleted].id;
    const {
      [nodeDeleted]: removed,
      ...rest
    } = actions;
    actions = Object.values(rest).length ? rest : [];
  }
  return Object.values(actions).map(action => ({
    name: action.id,
    id: action.id,
    linkTo: [...action.blockingActionIds.filter(actionId => actionId !== removedId)],
  }));
}

export default function GraphDisplayer({ name }) {
  const [nodes, setNodes] = useState(getNodes());
  useEffect(() => {
    GraphStore.getInstance().getGraph(name).subject.subscribe({
      next: ({ nodeDeleted }) => setNodes(getNodes(nodeDeleted)),
    });

    return () => {
      GraphStore.getInstance().getGraph(name).subject.unsubscribe();
    };
  }, []);

  useEffect(() => {
    renderGraph(nodes);
  }, [nodes]);

  return null;
}

GraphDisplayer.propTypes = {
  name: PropTypes.string.isRequired,
};
