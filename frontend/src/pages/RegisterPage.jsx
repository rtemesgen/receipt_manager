import { useState } from 'react';
import { apiRequest } from '../lib/api';
import AuthCard from '../components/AuthCard';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  businessName: '',
  businessPhone: '',
  footerMessage: '',
  website: '',
  taxId: '',
  logoUrl: ''
};

export default function RegisterPage({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
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
      const response = await apiRequest('/auth/register', { method: 'POST', body: form });
      onSuccess(response);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Register" subtitle="Create one user account and we’ll prefill your receipt settings from the business details you enter here." footerText="Already registered?" footerLabel="Login" footerLink="/login">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Full name<input name="fullName" value={form.fullName} onChange={updateField} required /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={updateField} required /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={updateField} required /></label>
        <label className="full-span">Address<textarea name="address" value={form.address} onChange={updateField} required /></label>
        <label>Business name<input name="businessName" value={form.businessName} onChange={updateField} required /></label>
        <label>Business phone<input name="businessPhone" value={form.businessPhone} onChange={updateField} /></label>
        <label className="full-span">Footer message<textarea name="footerMessage" value={form.footerMessage} onChange={updateField} /></label>
        <label>Website<input name="website" value={form.website} onChange={updateField} /></label>
        <label>Tax ID<input name="taxId" value={form.taxId} onChange={updateField} /></label>
        <label className="full-span">Logo URL<input name="logoUrl" value={form.logoUrl} onChange={updateField} /></label>
        {error ? <div className="error-banner full-span">{error}</div> : null}
        <button className="primary-button full-span" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button>
      </form>
    </AuthCard>
  );
}
