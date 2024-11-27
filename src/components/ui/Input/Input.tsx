import {
  HTMLAttributes,
  ReactNode,
  useMemo,
} from 'react';

import styles from './Input.module.css';

interface TextAreaProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'children'> {
  isTextArea: true;
  maxHeight?: number | string;
}

interface InputElementProps extends HTMLAttributes<HTMLInputElement> {
  isTextArea: false;
}

type InputProps = (TextAreaProps | InputElementProps) & {
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  value: string;
  placeholder?: string;
  className?: string;
};

const Input = (
  {
    startDecorator,
    endDecorator,
    value,
    placeholder,
    isTextArea,
    ...props
  }: InputProps
) => {
  const inputElement = useMemo(() => {
    if (isTextArea) {
      const {  maxHeight, ...rest } = props as TextAreaProps;
      return (
        <textarea
          className={styles.textarea}
          style={maxHeight ? { maxHeight } : {}}
          value={value}
          placeholder={placeholder}
          {...(rest as TextAreaProps)}
        />
      );
    }

    const { ...rest } = props as InputElementProps;

    return (
      <input
        autoComplete="off"
        type="text"
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    );
  }, [isTextArea, placeholder, props, value]);

  return (
    <div>
        {startDecorator && <span className={styles.decorator}>{startDecorator}</span>}
        {inputElement}
        {endDecorator && <span className={styles.decorator}>{endDecorator}</span>}
    </div>
  );
};

export default Input;
