import { FC } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
