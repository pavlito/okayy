import styles from './footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.wrapper}>
      <div className="container">
        <div className={styles.row}>
          <p className={styles.p}>MIT {new Date().getFullYear()}</p>
          <p className={styles.p}>
            Built by{' '}
            <a
              href="https://github.com/pav-luc"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Pavle Lucic
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
