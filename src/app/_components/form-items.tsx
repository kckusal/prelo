"use client";

import { type ReactNode, type FC } from "react";

import cx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasErrors?: boolean;
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasErrors?: boolean;
};

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  requiredMark?: boolean;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasErrors?: boolean;
};

const Button: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={cx(
        " inline-flex items-center justify-center border bg-gray-900 px-3 py-1 text-white hover:text-opacity-80 active:text-opacity-100",
        className,
      )}
      {...props}
    />
  );
};

interface ErrorProps {
  className?: string;
  children: ReactNode;
}

const Error: FC<ErrorProps> = ({ className, children, ...props }) => {
  return (
    <div className={cx(" text-sm text-red-600", className)} {...props}>
      {children}
    </div>
  );
};

interface HelpProps {
  className?: string;
  children: ReactNode;
}

const Help: FC<HelpProps> = ({ className, children, ...props }) => {
  return (
    <div className={cx(" text-xs text-gray-600", className)} {...props}>
      {children}
    </div>
  );
};

const Input: FC<InputProps> = ({ className, hasErrors, ...props }) => {
  return (
    <input
      className={cx(
        " w-full border border-gray-300 px-2 py-1 placeholder:text-sm placeholder:text-gray-300",
        {
          " border-red-500 outline-red-400": hasErrors,
        },
        className,
      )}
      {...props}
    />
  );
};

const TextArea: FC<TextAreaProps> = ({ className, hasErrors, ...props }) => {
  return (
    <textarea
      className={cx(
        " w-full border border-gray-300 px-2 py-1 placeholder:text-sm placeholder:text-gray-300",
        {
          " border-red-500 outline-red-400": hasErrors,
        },
        className,
      )}
      {...props}
    />
  );
};

const Select: FC<SelectProps> = ({ className, hasErrors, ...props }) => {
  return (
    <select
      className={cx(
        " w-full border border-gray-300 px-2 py-1 placeholder:text-sm placeholder:text-gray-300",
        {
          " border-red-500 outline-red-400": hasErrors,
        },
        className,
      )}
      {...props}
    />
  );
};

const Label: FC<LabelProps> = ({
  className,
  requiredMark,
  children,
  ...props
}) => {
  return (
    <label className={cx(" w-full", className)} {...props}>
      {children}
      {requiredMark && <span className=" ml-1 text-red-600">*</span>}
    </label>
  );
};

interface ItemProps {
  children: ReactNode;
  className?: string;
  Error?: ReactNode;
  Help?: ReactNode;
  Label: ReactNode;
}

const Item: FC<ItemProps> = ({ children, className, Error, Help, Label }) => {
  return (
    <div className={cx(" flex flex-col gap-y-1", className)}>
      {Label}
      {Help}
      {children}
      {Error}
    </div>
  );
};

const Form = {
  Button,
  Error,
  Help,
  Input,
  Item,
  Label,
  TextArea,
  Select,
};

export default Form;
