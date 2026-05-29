import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

type SiteLayoutProps = {
  children: ReactNode;
};

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">HM</span>
          <span>
            <strong>Hotel Maitre</strong>
            <small>Order management</small>
          </span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/bill" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Bill Page
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            History
          </NavLink>
        </nav>
      </header>

      <main className="page-frame">{children}</main>
    </div>
  );
}

export default SiteLayout;