import React, { useEffect, useRef } from "react";
import styles from "./FormComponents.module.scss";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const FormInput = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete = "off",
  className = styles.formInput,
}: FormInputProps) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};

interface FormTextareaProps {
  name: string;
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const FormTextarea = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = styles.formTextarea,
}: FormTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }
  };

  useEffect(() => {
    updateHeight();
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event);
    updateHeight();
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
};
