import React from 'react'

/**
 * Card – Reusable card with icon, title, subtitle, badge, footer, and glass mode.
 */
const Card = ({
  title, subtitle, icon, badge, badgeVariant = 'primary',
  children, footer, glass = false, hover = true, onClick, id, style,
}) => {
  const cls = [
    glass ? 'glass-card' : 'card',
    !hover ? 'no-hover' : '',
    onClick ? 'clickable' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      id={id}
      className={cls}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {(icon || title || badge) && (
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: children || subtitle ? '12px' : 0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {icon && (
              <div style={{ fontSize:'1.6rem', width:'48px', height:'48px', borderRadius:'12px', background:'var(--bg-surface)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {icon}
              </div>
            )}
            <div>
              {title    && <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:'2px', color:'var(--text-primary)' }}>{title}</h3>}
              {subtitle && <p  style={{ fontSize:'.85rem', color:'var(--text-secondary)' }}>{subtitle}</p>}
            </div>
          </div>
          {badge && <span className={`badge badge-${badgeVariant}`}>{badge}</span>}
        </div>
      )}
      {children}
      {footer && (
        <>
          <hr className="divider" style={{ marginBottom:'16px' }} />
          {footer}
        </>
      )}
    </div>
  )
}

export default Card
