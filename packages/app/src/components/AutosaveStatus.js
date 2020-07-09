import React, { useState, useEffect } from 'react';
import GraphStore from '@amoretto/action-graph';

export default function AutosaveStatus() {
  const [status, setStatus] = useState(GraphStore.getInstance().getGraph('test').statusManager.status);
  const [cancellations, setCancellations] = useState(GraphStore.getInstance().getGraph('test').statusManager.cancellations);
  const [errors, setErrors] = useState(Object.keys(GraphStore.getInstance().getGraph('test').statusManager.errors).length);

  useEffect(() => {
    const statusSubscription = GraphStore.getInstance().getGraph('test')
      .statusManager.subject.subscribe({
        next: ({ status, cancellations, errors }) => {
          setStatus(status);
          setCancellations(cancellations);
          setErrors(errors);
        },
      });
    return () => {
      statusSubscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      The autosaving status is:
      <span className={`status status-${status}`}>{status}</span>
      <br />
      <span>
        {cancellations}
        &nbsp;
        cancellations
      </span>
      <br />
      <span>
        {errors}
        &nbsp;
        errors
      </span>
    </div>
  );
}
