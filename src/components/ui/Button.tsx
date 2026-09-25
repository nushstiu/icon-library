import type { ButtonHTMLAttributes } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { UiIcon, type UiIconName } from './UiIcon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: UiIconName
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon && <UiIcon name={icon} className={size === 'sm' ? 'size-3.5' : 'size-4'} />}
      {children}
    </button>
  )
}
