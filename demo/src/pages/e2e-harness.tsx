import React from 'react';
import { confirm } from 'okayy';

export default function E2EHarness() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h1>E2E Test Harness</h1>

      {/* Basic */}
      <button data-testid="basic" onClick={() => confirm('Are you sure?')}>
        Basic
      </button>
      <button
        data-testid="with-description"
        onClick={() => confirm({ title: 'Delete?', description: 'This cannot be undone.' })}
      >
        With Description
      </button>
      <button
        data-testid="custom-buttons"
        onClick={() => confirm({ title: 'Delete?', confirmText: 'Yes', cancelText: 'No' })}
      >
        Custom Buttons
      </button>

      {/* Variants */}
      <button data-testid="danger" onClick={() => confirm({ title: 'Danger!', variant: 'danger' })}>
        Danger
      </button>
      <button
        data-testid="warning"
        onClick={() => confirm({ title: 'Warning!', variant: 'warning' })}
      >
        Warning
      </button>
      <button data-testid="info" onClick={() => confirm({ title: 'Info', variant: 'info' })}>
        Info
      </button>
      <button
        data-testid="success"
        onClick={() => confirm({ title: 'Success!', variant: 'success' })}
      >
        Success
      </button>

      {/* Async */}
      <button
        data-testid="async-confirm"
        onClick={() =>
          confirm({
            title: 'Processing',
            onConfirm: () => new Promise((r) => setTimeout(r, 1500)),
          })
        }
      >
        Async Confirm
      </button>
      <button
        data-testid="async-error"
        onClick={() =>
          confirm({
            title: 'Will Error',
            onConfirm: async () => {
              throw new Error('fail');
            },
          })
        }
      >
        Async Error
      </button>
      <button
        data-testid="async-return-false"
        onClick={() =>
          confirm({
            title: 'Return False',
            onConfirm: async () => false as const,
          })
        }
      >
        Async Return False
      </button>

      {/* Keyword */}
      <button
        data-testid="keyword"
        onClick={() =>
          confirm({
            title: 'Delete account?',
            confirmationKeyword: 'DELETE',
          })
        }
      >
        Keyword
      </button>

      {/* Sizes */}
      <button data-testid="size-sm" onClick={() => confirm({ title: 'Small', size: 'sm' })}>
        Size SM
      </button>
      <button data-testid="size-lg" onClick={() => confirm({ title: 'Large', size: 'lg' })}>
        Size LG
      </button>
      <button data-testid="size-xl" onClick={() => confirm({ title: 'XL', size: 'xl' })}>
        Size XL
      </button>
      <button data-testid="size-full" onClick={() => confirm({ title: 'Full', size: 'full' })}>
        Size Full
      </button>

      {/* Alert mode */}
      <button data-testid="alert" onClick={() => confirm.alert('Notice')}>
        Alert
      </button>

      {/* Non-dismissible */}
      <button
        data-testid="non-dismissible"
        onClick={() => confirm({ title: 'Stuck', dismissible: false })}
      >
        Non-dismissible
      </button>

      {/* Queue */}
      <button
        data-testid="queue-3"
        onClick={() => {
          confirm('First');
          confirm('Second');
          confirm('Third');
        }}
      >
        Queue 3
      </button>

      {/* Cancel events */}
      <button
        data-testid="cancel-events"
        onClick={async () => {
          const result = await confirm({
            title: 'Cancel test',
            onCancel: (reason) => {
              document.getElementById('cancel-reason')!.textContent = reason || '';
            },
          });
          document.getElementById('confirm-result')!.textContent = String(result);
        }}
      >
        Cancel Events
      </button>
      <span data-testid="cancel-reason" id="cancel-reason" />
      <span data-testid="confirm-result" id="confirm-result" />

      {/* Custom actions */}
      <button
        data-testid="custom-actions"
        onClick={() =>
          confirm({
            title: 'Choose',
            actions: [
              { label: 'Option A', onClick: async () => {} },
              { label: 'Option B', onClick: async () => {} },
            ],
          })
        }
      >
        Custom Actions
      </button>

      {/* Cancelable while loading */}
      <button
        data-testid="cancelable-loading"
        onClick={() =>
          confirm({
            title: 'Loading',
            cancelableWhileLoading: true,
            onConfirm: () => new Promise((r) => setTimeout(r, 5000)),
          })
        }
      >
        Cancelable While Loading
      </button>

      {/* Custom events listener */}
      <button
        data-testid="listen-events"
        onClick={() => {
          window.addEventListener(
            'okayy:confirm',
            () => {
              document.getElementById('event-log')!.textContent += 'confirm,';
            },
            { once: true },
          );
          window.addEventListener(
            'okayy:cancel',
            () => {
              document.getElementById('event-log')!.textContent += 'cancel,';
            },
            { once: true },
          );
          window.addEventListener(
            'okayy:close',
            () => {
              document.getElementById('event-log')!.textContent += 'close,';
            },
            { once: true },
          );
          confirm('Event test');
        }}
      >
        Listen Events
      </button>
      <span data-testid="event-log" id="event-log" />

      {/* RTL */}
      <button data-testid="rtl" onClick={() => confirm({ title: 'RTL Test', dir: 'rtl' })}>
        RTL
      </button>

      {/* TestId */}
      <button
        data-testid="with-testid"
        onClick={() => confirm({ title: 'TestId', testId: 'my-dialog' })}
      >
        With TestId
      </button>

      {/* Variant shortcuts */}
      <button
        data-testid="shortcut-danger"
        onClick={() => confirm.danger({ title: 'Danger shortcut' })}
      >
        Shortcut Danger
      </button>
      <button
        data-testid="shortcut-warning"
        onClick={() => confirm.warning({ title: 'Warning shortcut' })}
      >
        Shortcut Warning
      </button>
      <button
        data-testid="shortcut-info"
        onClick={() => confirm.info({ title: 'Info shortcut' })}
      >
        Shortcut Info
      </button>
      <button
        data-testid="shortcut-success"
        onClick={() => confirm.success({ title: 'Success shortcut' })}
      >
        Shortcut Success
      </button>

      {/* Custom render */}
      <button
        data-testid="custom-render"
        onClick={() =>
          confirm.custom((close) => (
            <div data-testid="custom-body" style={{ padding: '2rem' }}>
              <p>Custom content</p>
              <button data-testid="custom-close-true" onClick={() => close(true)}>
                Accept
              </button>
              <button data-testid="custom-close-false" onClick={() => close(false)}>
                Reject
              </button>
            </div>
          ))
        }
      >
        Custom Render
      </button>

      {/* Dismiss */}
      <button
        data-testid="dismiss-test"
        onClick={async () => {
          const promise = confirm({
            title: 'Dismiss me',
            onCancel: (reason) => {
              document.getElementById('dismiss-reason')!.textContent = reason || '';
            },
            onDismiss: () => {
              document.getElementById('dismiss-called')!.textContent = 'yes';
            },
          });
          // Dismiss after a short delay
          setTimeout(() => confirm.dismiss(), 500);
          const result = await promise;
          document.getElementById('dismiss-result')!.textContent = String(result);
        }}
      >
        Dismiss Test
      </button>
      <span data-testid="dismiss-reason" id="dismiss-reason" />
      <span data-testid="dismiss-called" id="dismiss-called" />
      <span data-testid="dismiss-result" id="dismiss-result" />

      {/* isOpen */}
      <button
        data-testid="is-open-test"
        onClick={() => {
          confirm('Check isOpen');
          document.getElementById('is-open-value')!.textContent = String(confirm.isOpen());
        }}
      >
        isOpen Test
      </button>
      <span data-testid="is-open-value" id="is-open-value" />

      {/* Centered layout */}
      <button
        data-testid="centered"
        onClick={() =>
          confirm({ title: 'Centered', description: 'Centered layout', layout: 'centered' })
        }
      >
        Centered
      </button>

      {/* ClassNames */}
      <button
        data-testid="classnames"
        onClick={() =>
          confirm({
            title: 'Styled',
            description: 'With classNames',
            classNames: {
              dialog: 'custom-dialog-class',
              overlay: 'custom-overlay-class',
              title: 'custom-title-class',
              description: 'custom-desc-class',
              confirmButton: 'custom-confirm-class',
              cancelButton: 'custom-cancel-class',
              content: 'custom-content-class',
              footer: 'custom-footer-class',
            },
          })
        }
      >
        ClassNames
      </button>

      {/* Unstyled */}
      <button
        data-testid="unstyled"
        onClick={() => confirm({ title: 'Unstyled', unstyled: true })}
      >
        Unstyled
      </button>

      {/* Overlay className */}
      <button
        data-testid="overlay-class"
        onClick={() =>
          confirm({ title: 'Overlay', overlayClassName: 'my-overlay-class' })
        }
      >
        Overlay Class
      </button>

      {/* ariaLabel */}
      <button
        data-testid="aria-label"
        onClick={() => confirm({ title: 'With Label', ariaLabel: 'Custom accessible label' })}
      >
        Aria Label
      </button>

      {/* Inline style */}
      <button
        data-testid="inline-style"
        onClick={() =>
          confirm({ title: 'Styled', style: { maxWidth: '20rem', borderRadius: '1rem' } })
        }
      >
        Inline Style
      </button>

      {/* Scroll lock test — page has enough content to scroll */}
      <button
        data-testid="scroll-lock"
        onClick={() => confirm({ title: 'Scroll lock test' })}
      >
        Scroll Lock
      </button>
      <div style={{ height: '200vh', background: 'linear-gradient(#eee, #999)' }} data-testid="tall-content">
        Tall content for scroll testing
      </div>
    </div>
  );
}
