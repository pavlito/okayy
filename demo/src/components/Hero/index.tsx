import { confirm } from 'affirm';
import Link from 'next/link';

import styles from './hero.module.css';

export const Hero = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>affirm</h1>
      <p style={{ marginTop: 0, fontSize: 18, textAlign: 'center' }}>
        A confirm dialog for React. One line. Beautiful.
      </p>
      <div className={styles.buttons}>
        <button
          data-primary=""
          onClick={() => {
            confirm({
              title: 'Delete this project?',
              description: 'This action cannot be undone. All data will be permanently removed.',
              confirmText: 'Delete',
              cancelText: 'Cancel',
              variant: 'danger',
            });
          }}
          className={styles.button}
        >
          Try it
        </button>
        <a className={styles.button} href="https://github.com/pavlito/affirm" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
      <Link href="/getting-started" className={styles.link}>
        Documentation
      </Link>
    </div>
  );
};
