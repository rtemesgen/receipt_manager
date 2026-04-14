import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

const emptySettings = {
  businessName: '',
  address: '',
  phone: '',
  thankYouMessage: '',
  website: '',
  taxId: '',
  logoUrl: ''
};

export default function SettingsPage({ auth, settings, onUpdated }) {
  const [form, setForm] = useState(emptySettings);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm({ ...emptySettings, ...settings });
    }
  }, [settings]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Saving...');
    setError('');

    try {
      await apiRequest('/settings', { method: 'PUT', token: auth.token, body: form });
      await onUpdated();
      setStatus('Settings updated');
    } catch (err) {
      setStatus('');
      setError(err.message || 'Could not update settings');
    }
  }

  return (
    <section className="panel-stack">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Receipt settings</p>
          <h2>Brand every new receipt</h2>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>Business name<input name="businessName" value={form.businessName} onChange={updateField} required /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={updateField} required /></label>
        <label className="full-span">Address<textarea name="address" value={form.address} onChange={updateField} required /></label>
        <label className="full-span">Thank you message<textarea name="thankYouMessage" value={form.thankYouMessage} onChange={updateField} /></label>
        <label>Website<input name="website" value={form.website} onChange={updateField} /></label>
        <label>Tax ID<input name="taxId" value={form.taxId} onChange={updateField} /></label>
        <label className="full-span">Logo URL<input name="logoUrl" value={form.logoUrl} onChange={updateField} /></label>
        {error ? <div className="error-banner full-span">{error}</div> : null}
        {status ? <div className="success-banner full-span">{status}</div> : null}
        <button className="primary-button full-span" type="submit">Save settings</button>
      </form>
    </section>
  );
}
