import { FC } from 'react';

import Search from '@/components/shared/Search/Search';
import styles from './Header.module.css';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <h1>Kanban Board</h1>
      <Search />
    </header>
  );
};

export default Header;
