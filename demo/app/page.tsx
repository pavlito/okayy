'use client';

import { confirm } from 'affirm';

export default function Home() {
  const handleTryIt = async () => {
    const ok = await confirm({
      title: 'Delete this project?',
      description: 'This action cannot be undone. All data will be permanently removed.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    console.log('Result:', ok);
  };

  const handleDefault = async () => {
    const ok = await confirm('Are you sure you want to continue?');
    console.log('Default:', ok);
  };

  const handleDanger = async () => {
    const ok = await confirm.danger({
      title: 'Delete account?',
      description: 'This will permanently delete your account and all associated data.',
      confirmText: 'Delete Account',
    });
    console.log('Danger:', ok);
  };

  const handleWarning = async () => {
    const ok = await confirm.warning({
      title: 'Unsaved changes',
      description: 'You have unsaved changes. Are you sure you want to leave?',
      confirmText: 'Leave',
    });
    console.log('Warning:', ok);
  };

  const handleInfo = async () => {
    const ok = await confirm.info({
      title: 'Update available',
      description: 'A new version is available. Would you like to update now?',
      confirmText: 'Update',
    });
    console.log('Info:', ok);
  };

  const handleSuccess = async () => {
    const ok = await confirm.success({
      title: 'Publish changes?',
      description: 'Your changes will be live immediately.',
      confirmText: 'Publish',
    });
    console.log('Success:', ok);
  };

  const handleAsync = async () => {
    const ok = await confirm({
      title: 'Deploy to production?',
      description: 'This will deploy your changes to the production environment.',
      confirmText: 'Deploy',
      variant: 'default',
      onConfirm: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
    });
    console.log('Async:', ok);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-[family-name:var(--font-geist-sans)]">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-white/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          v0.0.1 — 1.6 KB gzipped
        </div>
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-4">affirm</h1>
        <p className="text-xl text-white/50 max-w-md text-center mb-10">
          A confirm dialog for React. One line. Beautiful.
        </p>
        <code className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 font-[family-name:var(--font-geist-mono)] mb-10">
          npm install affirm
        </code>
        <button
          onClick={handleTryIt}
          className="px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-white/90 active:scale-[0.97] transition-all"
        >
          Try it
        </button>
      </div>

      {/* Variants */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-2">Variants</h2>
        <p className="text-white/50 mb-8">Five built-in color schemes for every context.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDefault}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 active:scale-[0.97] transition-all"
          >
            Default
          </button>
          <button
            onClick={handleDanger}
            className="px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/25 active:scale-[0.97] transition-all"
          >
            Danger
          </button>
          <button
            onClick={handleWarning}
            className="px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-medium hover:bg-amber-500/25 active:scale-[0.97] transition-all"
          >
            Warning
          </button>
          <button
            onClick={handleInfo}
            className="px-4 py-2 rounded-lg bg-blue-500/15 text-blue-400 text-sm font-medium hover:bg-blue-500/25 active:scale-[0.97] transition-all"
          >
            Info
          </button>
          <button
            onClick={handleSuccess}
            className="px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 active:scale-[0.97] transition-all"
          >
            Success
          </button>
        </div>
      </div>

      {/* Async Loading */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-2">Async Loading</h2>
        <p className="text-white/50 mb-8">
          Pass an async <code className="text-white/70 font-[family-name:var(--font-geist-mono)] text-xs bg-white/5 px-1.5 py-0.5 rounded">onConfirm</code> handler — the button shows a spinner automatically.
        </p>
        <button
          onClick={handleAsync}
          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 active:scale-[0.97] transition-all"
        >
          Deploy (2s delay)
        </button>
      </div>

      {/* Code Comparison */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <h2 className="text-2xl font-semibold mb-2">Why affirm?</h2>
        <p className="text-white/50 mb-8">Less code. Same power.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 text-sm text-white/40 font-medium">
              affirm — 3 lines
            </div>
            <pre className="p-4 text-sm font-[family-name:var(--font-geist-mono)] text-emerald-400 overflow-x-auto">
{`import { confirm } from 'affirm';

const ok = await confirm('Delete?');
if (ok) deleteItem();`}
            </pre>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 text-sm text-white/40 font-medium">
              Typical AlertDialog — 20+ lines
            </div>
            <pre className="p-4 text-sm font-[family-name:var(--font-geist-mono)] text-white/40 overflow-x-auto">
{`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">
      Delete
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete?
      </AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={deleteItem}
      >
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
