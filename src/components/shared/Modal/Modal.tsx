import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/Button/Button';
import { addCorrespondingBackground } from '@/util/addCorrespondingBackground';

interface ModalProps extends PropsWithChildren {
  open?: boolean;
  onClose?: () => void;
  showClose?: boolean;
  title?: ReactNode;
  actions?: ReactNode;
  columnId?: columnId | undefined;
}

const Modal: FC<ModalProps> = ({
  open: defaultOpen = false,
  onClose,
  showClose = true,
  title,
  actions,
  children,
  columnId,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.modal} data-testid='modal-content'>
      <div className={styles.backdrop} onClick={handleClose} data-testid='backdrop' />
      <div className={styles.container}>
        <div
          className={styles.modalContent}
          style={{
            '--modal-background': columnId ? addCorrespondingBackground(columnId) : '#11131e',
          }}
          data-testid='modalContent'
        >
          {(title || showClose) && (
            <header className={styles.header}>
              {title && <div className={styles.title}>{title}</div>}
              {showClose && <Button onClick={handleClose}>x</Button>}
            </header>
          )}
          {children}
          {actions && <footer className={styles.actions}>{actions}</footer>}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
