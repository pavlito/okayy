import { CodeBlock } from '../CodeBlock';

export const Usage = () => {
  return (
    <div>
      <h2>Usage</h2>
      <p>Render the Confirmer in the root of your app, then call confirm() anywhere.</p>
      <CodeBlock initialHeight={270}>{`import { Confirmer, confirm } from 'okayy';
import 'okayy/styles.css';

// Add Confirmer to your root layout
function App() {
  return (
    <div>
      <Confirmer />
      <button onClick={async () => {
        const ok = await confirm('Delete this item?');
        if (ok) deleteItem();
      }}>
        Delete
      </button>
    </div>
  )
}`}</CodeBlock>
    </div>
  );
};
