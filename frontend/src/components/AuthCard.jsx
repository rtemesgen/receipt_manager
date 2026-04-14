import { Link, useLocation } from 'react-router-dom';

export default function AuthCard({ title, subtitle, children, footerLabel, footerLink, footerText }) {
  const location = useLocation();

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <p className="eyebrow">Mini project</p>
        <h1>Receipt Manager</h1>
        <p>{subtitle}</p>
      </div>
      <div className="auth-card">
        <h2>{title}</h2>
        {location.state?.message ? <div className="success-banner">{location.state.message}</div> : null}
        {children}
        <p className="auth-switch">
          {footerText} <Link to={footerLink}>{footerLabel}</Link>
        </p>
      </div>
    </div>
  );
}
