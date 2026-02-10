import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import copy from 'copy-to-clipboard';

import styles from './preview.module.css';

const theme = {
  plain: {
    color: 'var(--gray12)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
  },
  styles: [
    { types: ['comment'], style: { color: 'var(--gray9)' } },
    { types: ['atrule', 'keyword', 'attr-name', 'selector', 'string'], style: { color: 'var(--gray11)' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--gray9)' } },
    { types: ['class-name', 'function', 'tag'], style: { color: 'var(--gray12)' } },
  ],
};

interface PreviewOption {
  name: string;
  code: string;
  action: () => void;
}

interface MultiPreviewProps {
  options: PreviewOption[];
}

export const MultiPreview = ({ options }: MultiPreviewProps) => {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview');
  const [active, setActive] = React.useState(options[0]);
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    copy(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <button className={styles.tab} data-active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </button>
        <button className={styles.tab} data-active={tab === 'code'} onClick={() => setTab('code')}>
          Code
        </button>
        <button className={styles.copyButton} onClick={onCopy}>
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      {tab === 'preview' ? (
        <div className={styles.previewArea}>
          {options.map((opt) => (
            <button
              key={opt.name}
              className="button"
              data-active={active.name === opt.name}
              onClick={() => {
                opt.action();
                setActive(opt);
              }}
              style={{ margin: 0 }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.codeArea}>
          {/* @ts-ignore */}
          <Highlight {...defaultProps} theme={theme} code={active.code} language="jsx">
            {({ className, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} ${styles.code}`}>
                {tokens.map((line, i) => {
                  const { key: lineKey, ...rest } = getLineProps({ line, key: i });
                  return (
                    <div key={lineKey} {...rest}>
                      {line.map((token, key) => {
                        const { key: tokenKey, ...rest } = getTokenProps({ token, key });
                        return <span key={tokenKey} {...rest} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      )}
    </div>
  );
};
