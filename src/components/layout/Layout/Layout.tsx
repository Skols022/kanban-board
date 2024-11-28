import { ReactNode } from 'react';

import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className={styles.layout}>
        <div className={styles.frame}>
          <div />
          <div />
        </div>
        {children}
        </main>
        <footer className={styles.footer}></footer>
    </>
  );
};

export default Layout;
