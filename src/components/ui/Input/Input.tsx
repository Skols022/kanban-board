import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
  useMemo,
} from 'react';

import styles from './Input.module.css';

interface TextAreaProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'children'> {
  isTextArea: true;
  maxHeight?: number | string;
  ref?: RefObject<HTMLTextAreaElement>
}

interface InputElementProps extends HTMLAttributes<HTMLInputElement> {
  isTextArea: false;
  ref?: RefObject<HTMLInputElement>
}

type InputProps = (TextAreaProps | InputElementProps) & {
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  value?: string;
  placeholder?: string;
  className?: string;
};

const Input = forwardRef<HTMLTextAreaElement | HTMLInputElement, InputProps>((
  {
    startDecorator,
    endDecorator,
    value,
    placeholder,
    isTextArea,
    ...props
  }: InputProps,
  ref: Ref<HTMLTextAreaElement | HTMLInputElement>
) => {
  const inputElement = useMemo(() => {
    if (isTextArea) {
      const {  maxHeight, ...rest } = props as TextAreaProps;
      return (
        <textarea
          ref={ref as Ref<HTMLTextAreaElement>}
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
        ref={ref as Ref<HTMLInputElement>}
        autoComplete="off"
        type="text"
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    );
  }, [isTextArea, placeholder, props, ref, value]);

  return (
    <div>
        {startDecorator && <span className={styles.decorator}>{startDecorator}</span>}
        {inputElement}
        {endDecorator && <span className={styles.decorator}>{endDecorator}</span>}
    </div>
  );
});

export default Input;
