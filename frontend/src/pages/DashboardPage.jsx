import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function DeleteReceiptModal({ receipt, onCancel, onConfirm, deleting }) {
  if (!receipt) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-receipt-title">
      <div className="modal-card">
        <p className="eyebrow">Confirm delete</p>
        <h3 id="delete-receipt-title">Delete receipt #{receipt.id}?</h3>
        <p className="muted">This will permanently remove the receipt for {receipt.customerName}.</p>
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

function ReceiptActions({ receipt, onEdit, onDelete }) {
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
    <div className="receipt-menu" ref={menuRef} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="menu-trigger"
        aria-label="Receipt actions"
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
      >
        ...
      </button>
      {open ? (
        <div className="menu-popover">
          <button type="button" className="menu-item" onClick={() => { setOpen(false); onEdit(receipt.id); }}>Edit receipt</button>
          <button type="button" className="menu-item danger" onClick={() => { setOpen(false); onDelete(receipt); }}>Delete receipt</button>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage({ receipts, onDelete, onEdit }) {
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function confirmDelete() {
    if (!receiptToDelete) {
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await onDelete(receiptToDelete.id);
      setReceiptToDelete(null);
    } catch (err) {
      setError(err.message || 'Could not delete receipt');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <section className="panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Saved receipts</p>
            <h2>Recent receipts</h2>
          </div>
          <Link className="primary-button" to="/receipts/new">Create receipt</Link>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="receipt-grid refined-grid">
          {receipts.length === 0 ? (
            <div className="empty-state">
              <h3>No receipts yet</h3>
              <p>Create your first receipt and it will appear here for preview, editing, and printing.</p>
            </div>
          ) : receipts.map((receipt) => (
            <article key={receipt.id} className="receipt-card refined-card">
              <div className="receipt-card-top">
                <div>
                  <p className="receipt-label">Receipt #{receipt.id}</p>
                  <strong>{receipt.customerName}</strong>
                </div>
                <ReceiptActions receipt={receipt} onEdit={onEdit} onDelete={setReceiptToDelete} />
              </div>
              <Link to={`/receipts/${receipt.id}`} className="receipt-card-link">
                <div className="receipt-card-body">
                  <div>
                    <span>Date</span>
                    <strong>{receipt.date}</strong>
                  </div>
                  <div>
                    <span>Payment</span>
                    <strong>{receipt.paymentMethod}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{Number(receipt.total).toFixed(2)}</strong>
                  </div>
                </div>
              </Link>
            </article>
          ))}
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
