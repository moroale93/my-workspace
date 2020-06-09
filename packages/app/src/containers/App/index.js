import React from 'react';
import GraphDisplayer from '../../components/GraphDisplayer';
import GraphStore, { Action } from '@amoretto/action-graph';

export default function App() {
  function onClick() {
    GraphStore
      .getInstance()
      .getGraph('test')
      .addNode(new Action(['ADD'], ['ADD'], () => new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 3000);
      })));
  }

  return (
    <div>
      <button type="button" onClick={onClick}>Add</button>
      <GraphDisplayer name="test" />
    </div>
  );
}
