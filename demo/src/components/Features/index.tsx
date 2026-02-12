import React from 'react';
import { confirm } from 'affirm';
import { CodeBlock } from '../CodeBlock';

export const Features = () => {
  const [activeFeature, setActiveFeature] = React.useState(allFeatures[0]);

  return (
    <div>
      <h2>Features</h2>
      <p>Powerful features built in. Alert mode, type-to-confirm, centered layout, and async loading.</p>
      <div className="buttons">
        {allFeatures.map((feature) => (
          <button
            className="button"
            data-active={activeFeature.name === feature.name}
            onClick={() => {
              feature.action();
              setActiveFeature(feature);
            }}
            key={feature.name}
          >
            {feature.name}
          </button>
        ))}
      </div>
      <CodeBlock>{`${activeFeature.snippet}`}</CodeBlock>
    </div>
  );
};

const allFeatures = [
  {
    name: 'Alert',
    snippet: `await confirm.alert('Your session has expired. Please log in again.');`,
    action: () => confirm.alert('Your session has expired. Please log in again.'),
  },
  {
    name: 'Type-to-Confirm',
    snippet: `const ok = await confirm({
  title: 'Delete repository?',
  description: 'This will permanently delete the repository and all its contents.',
  confirmText: 'Delete',
  variant: 'danger',
  confirmationKeyword: 'DELETE',
});`,
    action: () =>
      confirm({
        title: 'Delete repository?',
        description: 'This will permanently delete the repository and all its contents.',
        confirmText: 'Delete',
        variant: 'danger',
        confirmationKeyword: 'DELETE',
      }),
  },
  {
    name: 'Centered',
    snippet: `const ok = await confirm.warning({
  title: 'Discard draft?',
  description: 'Your unsaved draft will be permanently lost.',
  confirmText: 'Discard',
  layout: 'centered',
});`,
    action: () =>
      confirm.warning({
        title: 'Discard draft?',
        description: 'Your unsaved draft will be permanently lost.',
        confirmText: 'Discard',
        layout: 'centered',
      }),
  },
  {
    name: 'Async',
    snippet: `const ok = await confirm({
  title: 'Deploy to production?',
  description: 'This will deploy your changes to the production environment.',
  confirmText: 'Deploy',
  onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
});`,
    action: () =>
      confirm({
        title: 'Deploy to production?',
        description: 'This will deploy your changes to the production environment.',
        confirmText: 'Deploy',
        onConfirm: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
      }),
  },
  {
    name: 'Custom',
    snippet: `const ok = await confirm.custom((close) => (
  <div style={{ padding: '1.5rem' }}>
    <h3>Custom Dialog</h3>
    <p>Render any React content.</p>
    <button onClick={() => close(true)}>OK</button>
  </div>
));`,
    action: () =>
      confirm.custom((close: (value: boolean) => void) => (
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem', color: 'var(--affirm-title-color)' }}>Custom Dialog</h3>
          <p style={{ margin: '0 0 1rem', color: 'var(--affirm-desc-color)', fontSize: '0.875rem' }}>This is fully custom content rendered inside the dialog.</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => close(false)} style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--affirm-cancel-border)', background: 'var(--affirm-cancel-bg)', color: 'var(--affirm-cancel-text)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => close(true)} style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--affirm-confirm-border)', background: 'var(--affirm-confirm-bg)', color: 'var(--affirm-confirm-text)', cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )),
  },
];
