import React, { ReactNode, MouseEventHandler } from "react";
import styles from "./Buttons.module.scss";
import Link from "next/link";

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

interface BaseButtonProps extends ButtonProps {
    baseClassName: string;
    isIcon?: boolean;
}

const BaseButton = ({ baseClassName, className = "", onClick, children, type = "button", disabled = false, isIcon = false }: BaseButtonProps) => (
  <button
    type={type}
    className={`${styles.btn} ${styles[baseClassName]} ${className} ${disabled ? styles["btn-disabled"] : ""} ${isIcon ? styles["btn-icon"] : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const PrimaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-primary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const SecondaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-secondary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const TertiaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-tertiary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const ClickableText = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-text" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const PrimaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-primary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

export const SecondaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-secondary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

export const TertiaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-tertiary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface BaseLinkProps extends LinkProps {
  baseClassName: string;
}

// We have BaseLinks as buttons can't be used in server side rendering
const BaseLink = ({ baseClassName, className = "", href, children }: BaseLinkProps) => (
  <Link 
    href={href}
    className={`${styles.btn} ${styles[baseClassName]} ${className}`}
  >
    {children}
  </Link>
);

export const PrimaryLink = ({ href, children, className = "" }: LinkProps) => (
  <BaseLink baseClassName="btn-primary" className={className} href={href}>
    {children}
  </BaseLink>
);

export const SecondaryLink = ({ href, children, className = "" }: LinkProps) => (
  <BaseLink baseClassName="btn-secondary" className={className} href={href}>
    {children}
  </BaseLink>
);

