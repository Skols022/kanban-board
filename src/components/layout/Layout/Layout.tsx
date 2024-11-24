import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header>Search</header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
