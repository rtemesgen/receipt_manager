import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import AuthCard from '../components/AuthCard';

export default function LoginPage({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiRequest('/auth/login', { method: 'POST', body: form });
      onSuccess(response);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Login" subtitle="Log in, manage settings, create receipts, and print exactly the one you need." footerText="Need an account?" footerLabel="Register" footerLink="/register">
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} required />
        </label>
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
        <Link className="text-link" to="/register">Create a new store account</Link>
      </form>
    </AuthCard>
  );
}
