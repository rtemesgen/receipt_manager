import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../lib/api';

function DeleteReceiptModal({ receipt, onCancel, onConfirm, deleting }) {
  if (!receipt) {
    return null;
  }

  return (
    <div className="modal-overlay no-print" role="dialog" aria-modal="true" aria-labelledby="preview-delete-receipt-title">
      <div className="modal-card">
        <p className="eyebrow">Confirm delete</p>
        <h3 id="preview-delete-receipt-title">Delete this receipt?</h3>
        <p className="muted">Receipt #{receipt.id} for {receipt.customerName} will be permanently removed.</p>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button type="button" className="primary-button danger-button" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete receipt'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewActions({ receipt, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="receipt-menu" ref={menuRef}>
      <button type="button" className="menu-trigger" onClick={() => setOpen((current) => !current)}>...</button>
      {open ? (
        <div className="menu-popover menu-popover-right">
          <button type="button" className="menu-item" onClick={() => { setOpen(false); onEdit(receipt.id); }}>Edit receipt</button>
          <button type="button" className="menu-item danger" onClick={() => { setOpen(false); onDelete(receipt); }}>Delete receipt</button>
        </div>
      ) : null}
    </div>
  );
}

export default function ReceiptPreviewPage({ auth, onDelete, onEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/receipts/${id}`, { token: auth.token })
      .then((data) => {
        if (!cancelled) {
          setReceipt(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Could not load receipt');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [auth.token, id]);

  async function confirmDelete() {
    if (!receiptToDelete) {
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await onDelete(receiptToDelete.id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not delete receipt');
    } finally {
      setDeleting(false);
    }
  }

  if (error && !receipt) {
    return <div className="error-banner">{error}</div>;
  }

  if (!receipt) {
    return <div className="page-center">Loading receipt preview...</div>;
  }

  const settings = receipt.settings || {};

  return (
    <>
      <section className="panel-stack print-page">
        <div className="panel-header no-print">
          <div>
            <p className="eyebrow">Receipt preview</p>
            <h2>Receipt #{receipt.id}</h2>
          </div>
          <div className="preview-actions">
            <PreviewActions receipt={receipt} onEdit={onEdit} onDelete={setReceiptToDelete} />
            <button className="primary-button" onClick={() => window.print()}>Print receipt</button>
          </div>
        </div>

        {error ? <div className="error-banner no-print">{error}</div> : null}

        <div className="receipt-preview panel printable-receipt refined-preview">
          <header className="receipt-topband">
            <div className="receipt-brand-block">
              {settings.logoUrl ? (
                <div className="receipt-logo-shell centered-logo-shell">
                  <img className="receipt-logo" src={settings.logoUrl} alt={`${settings.businessName || 'Business'} logo`} />
                </div>
              ) : null}
              <div className="receipt-brand-text">
                <p className="receipt-brand">{settings.businessName}</p>
                <div className="receipt-contact-stack">
                  <span>{settings.address}</span>
                  <span>{settings.phone}</span>
                  {settings.website ? <span>{settings.website}</span> : null}
                  {settings.taxId ? <span>Tax ID: {settings.taxId}</span> : null}
                </div>
              </div>
            </div>
            <div className="receipt-status-block">
              <span>Preview</span>
              <strong>#{receipt.id}</strong>
            </div>
          </header>

          <div className="receipt-meta refined-meta">
            <div><span>Date</span><strong>{receipt.date}</strong></div>
            <div><span>Customer</span><strong>{receipt.customerName}</strong></div>
            <div><span>Payment</span><strong>{receipt.paymentMethod}</strong></div>
          </div>

          <div className="receipt-items refined-items">
            <div className="receipt-item receipt-item-head">
              <strong>Item</strong>
              <strong>Qty</strong>
              <strong>Price</strong>
              <strong>Total</strong>
            </div>
            {receipt.items.map((item) => (
              <div key={item.id} className="receipt-item">
                <span>{item.itemName}</span>
                <span>{Number(item.quantity).toFixed(2)}</span>
                <span>{Number(item.price).toFixed(2)}</span>
                <span>{Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <footer className="receipt-footer refined-footer">
            <p className="footer-note">{settings.thankYouMessage}</p>
            <div className="receipt-total receipt-total-card">
              <span>Total</span>
              <strong>{Number(receipt.total).toFixed(2)}</strong>
            </div>
          </footer>
        </div>
      </section>

      <DeleteReceiptModal
        receipt={receiptToDelete}
        deleting={deleting}
        onCancel={() => !deleting && setReceiptToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
