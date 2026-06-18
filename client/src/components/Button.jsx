import React from 'react'

/**
 * Button – Reusable button with variant, size, loading, and icon support.
 *
 * Props: variant ('primary'|'secondary'|'ghost'|'accent'|'danger')
 *        size    ('sm'|'md'|'lg')
 *        fullWidth, loading, icon, disabled, id, type, onClick
 */
const Button = ({
  children,
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  loading   = false,
  icon,
  onClick,
  type      = 'button',
  disabled  = false,
  id,
  className = '',
  ...rest
}) => {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'lg' ? 'btn-lg' : '',
    size === 'sm' ? 'btn-sm' : '',
    fullWidth      ? 'btn-full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button id={id} type={type} className={cls} onClick={onClick} disabled={disabled || loading} {...rest}>
      {loading
        ? <><span className="spinner" />{children}</>
        : <>{icon && <span>{icon}</span>}{children}</>
      }
    </button>
  )
}

export default Button
