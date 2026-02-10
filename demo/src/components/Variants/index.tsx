import React from 'react';
import { confirm } from 'affirm';
import { CodeBlock } from '../CodeBlock';

export const Variants = () => {
  const [activeType, setActiveType] = React.useState(allTypes[0]);

  return (
    <div>
      <h2>Variants</h2>
      <p>Five built-in color schemes for every context. Each variant shows its own icon automatically.</p>
      <div className="buttons">
        {allTypes.map((type) => (
          <button
            className="button"
            data-active={activeType.name === type.name}
            onClick={() => {
              type.action();
              setActiveType(type);
            }}
            key={type.name}
          >
            {type.name}
          </button>
        ))}
      </div>
      <CodeBlock>{`${activeType.snippet}`}</CodeBlock>
    </div>
  );
};

const allTypes = [
  {
    name: 'Default',
    snippet: `const ok = await confirm('Are you sure you want to continue?');`,
    action: () => confirm('Are you sure you want to continue?'),
  },
  {
    name: 'Danger',
    snippet: `const ok = await confirm.danger({
  title: 'Delete account?',
  description: 'This will permanently delete your account and all associated data.',
  confirmText: 'Delete Account',
});`,
    action: () =>
      confirm.danger({
        title: 'Delete account?',
        description: 'This will permanently delete your account and all associated data.',
        confirmText: 'Delete Account',
      }),
  },
  {
    name: 'Warning',
    snippet: `const ok = await confirm.warning({
  title: 'Unsaved changes',
  description: 'You have unsaved changes. Are you sure you want to leave?',
  confirmText: 'Leave',
});`,
    action: () =>
      confirm.warning({
        title: 'Unsaved changes',
        description: 'You have unsaved changes. Are you sure you want to leave?',
        confirmText: 'Leave',
      }),
  },
  {
    name: 'Info',
    snippet: `const ok = await confirm.info({
  title: 'Update available',
  description: 'A new version is available. Would you like to update now?',
  confirmText: 'Update',
});`,
    action: () =>
      confirm.info({
        title: 'Update available',
        description: 'A new version is available. Would you like to update now?',
        confirmText: 'Update',
      }),
  },
  {
    name: 'Success',
    snippet: `const ok = await confirm.success({
  title: 'Publish changes?',
  description: 'Your changes will be live immediately.',
  confirmText: 'Publish',
});`,
    action: () =>
      confirm.success({
        title: 'Publish changes?',
        description: 'Your changes will be live immediately.',
        confirmText: 'Publish',
      }),
  },
];
