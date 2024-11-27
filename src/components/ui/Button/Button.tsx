import { HTMLAttributes, PropsWithChildren } from 'react';

import styles from './Button.module.css';

type ButtonProps = PropsWithChildren<HTMLAttributes<HTMLButtonElement>>;

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={styles.button} type='button' {...(props as HTMLAttributes<HTMLButtonElement>)}>
      <span>{children}</span>
    </button>
  );
};

export default Button;
