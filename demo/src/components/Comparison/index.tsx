import { CodeBlock } from '../CodeBlock';

export const Comparison = () => {
  return (
    <div>
      <h2>Why affirm?</h2>
      <p>Less code. Same power.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 0 }}>affirm — 3 lines</p>
          <CodeBlock>{`import { confirm } from 'affirm';

const ok = await confirm('Delete?');
if (ok) deleteItem();`}</CodeBlock>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 0 }}>Typical AlertDialog — 20+ lines</p>
          <CodeBlock>{`<AlertDialog>
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
</AlertDialog>`}</CodeBlock>
        </div>
      </div>
    </div>
  );
};
