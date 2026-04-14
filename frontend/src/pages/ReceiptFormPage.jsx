import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const blankForm = {
  customerName: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Cash',
  items: [{ itemName: '', quantity: '1', price: '0' }]
};

export default function ReceiptFormPage({ auth, onSaved }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setForm(blankForm);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    apiRequest(`/receipts/${id}`, { token: auth.token })
      .then((receipt) => {
        if (cancelled) {
          return;
        }
        setForm({
          customerName: receipt.customerName,
          date: receipt.date,
          paymentMethod: receipt.paymentMethod,
          items: receipt.items.map((item) => ({
            itemName: item.itemName,
            quantity: String(item.quantity),
            price: String(item.price)
          }))
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Could not load receipt');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [auth.token, id, isEditing]);

  const total = useMemo(() => form.items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    return sum + quantity * price;
  }, 0), [form.items]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateItem(index, field, value) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)
    }));
  }

  function addItem() {
    setForm((current) => ({ ...current, items: [...current.items, { itemName: '', quantity: '1', price: '0' }] }));
  }

  function removeItem(index) {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        items: form.items.map((item) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };
      const path = isEditing ? `/receipts/${id}` : '/receipts';
      const method = isEditing ? 'PUT' : 'POST';
      const receipt = await apiRequest(path, { method, token: auth.token, body: payload });
      await onSaved();
      navigate(`/receipts/${receipt.id}`);
    } catch (err) {
      setError(err.message || 'Could not save receipt');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page-center">Loading receipt editor...</div>;
  }

  return (
    <section className="panel-stack">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Receipt entry</p>
          <h2>{isEditing ? 'Edit receipt' : 'Create a receipt'}</h2>
        </div>
      </div>

      <form className="panel form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>Customer name<input name="customerName" value={form.customerName} onChange={updateField} required /></label>
          <label>Date<input name="date" type="date" value={form.date} onChange={updateField} required /></label>
          <label className="full-span">Payment method<input name="paymentMethod" value={form.paymentMethod} onChange={updateField} required /></label>
        </div>

        <div className="items-section">
          {form.items.map((item, index) => (
            <div key={index} className="item-row">
              <input placeholder="Item name" value={item.itemName} onChange={(event) => updateItem(index, 'itemName', event.target.value)} required />
              <input placeholder="Qty" type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} required />
              <input placeholder="Price" type="number" min="0" step="0.01" value={item.price} onChange={(event) => updateItem(index, 'price', event.target.value)} required />
              <button type="button" className="ghost-button" disabled={form.items.length === 1} onClick={() => removeItem(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="secondary-button" onClick={addItem}>Add item</button>
        </div>

        <div className="summary-bar">
          <span>Live total</span>
          <strong>{total.toFixed(2)}</strong>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Saving...' : isEditing ? 'Update receipt' : 'Save receipt'}</button>
      </form>
    </section>
  );
}
