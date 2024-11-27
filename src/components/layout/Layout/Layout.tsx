import { ReactNode } from 'react';

import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className={styles.layout}>{children}</main>
    </>
  );
};

export default Layout;
