import React, { useState, useEffect } from 'react';
import GraphStore from '@amoretto/action-graph';

export default function AutosaveStatus() {
  const [status, setStatus] = useState(GraphStore.getInstance().getGraph('test').statusManager.status);

  useEffect(() => {
    const statusManagerObservable = GraphStore.getInstance().getGraph('test').statusManager.subject;
    statusManagerObservable.subscribe({
      next: ({ status }) => {
        setStatus(status);
      },
    });
    return () => {
      statusManagerObservable.unsubscribe();
    };
  }, []);

  return (
    <div>
      The autosaving status is:
      <span className={`status status-${status}`}>{status}</span>
    </div>
  );
}
