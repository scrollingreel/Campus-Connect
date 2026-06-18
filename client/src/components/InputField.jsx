import React, { useState } from 'react'

/**
 * InputField – Controlled input with label, icon, error, hint, and password toggle.
 *
 * Props: id, label, type, value, onChange, placeholder, error, hint,
 *        icon, required, disabled, autoComplete
 */
const InputField = ({
  id, label, type = 'text', value, onChange, placeholder,
  error, hint, icon, required = false, disabled = false, autoComplete,
}) => {
  const [showPass, setShowPass] = useState(false)
  const isPassword  = type === 'password'
  const inputType   = isPassword && showPass ? 'text' : type

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--secondary)' }}>*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`form-input${error ? ' error' : ''}`}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
        {isPassword && (
          <button
            type="button"
            className="input-toggle-btn"
            onClick={() => setShowPass(v => !v)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
            id={`${id}-toggle`}
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <span id={`${id}-error`} className="form-error" role="alert">⚠️ {error}</span>}
      {hint && !error && <span id={`${id}-hint`} className="form-hint">{hint}</span>}
    </div>
  )
}

export default InputField
