import React from 'react'

/**
 * Layout – Common page wrapper: header + main + footer.
 * All pages are wrapped in this component for consistent structure.
 */
const Layout = ({ children, navbar, footer }) => (
  <div className="page-wrapper">
    <header>{navbar}</header>
    <main className="main-content">{children}</main>
    {footer}
  </div>
)

export default Layout
