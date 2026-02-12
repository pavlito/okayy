import { confirm } from 'affirm';
import Link from 'next/link';

import styles from './hero.module.css';

export const Hero = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dialogPreview} aria-hidden="true">
        <div className={styles.mockDialog}>
          <div className={styles.mockHeader}>
            <div className={styles.mockIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className={styles.mockTitle}>Delete project?</p>
              <p className={styles.mockDescription}>This action cannot be undone.</p>
            </div>
          </div>
          <div className={styles.mockFooter}>
            <button className={`${styles.mockButton} ${styles.mockCancel}`} tabIndex={-1}>Cancel</button>
            <button className={`${styles.mockButton} ${styles.mockConfirm}`} tabIndex={-1}>Delete</button>
          </div>
        </div>
      </div>
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
