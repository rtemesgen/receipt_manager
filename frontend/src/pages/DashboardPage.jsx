import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function ReceiptActions({ receipt, onDelete }) {
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

  async function handleDelete() {
    const confirmed = window.confirm(`Delete receipt for ${receipt.customerName}?`);
    if (!confirmed) {
      return;
    }
    await onDelete(receipt.id);
    setOpen(false);
  }

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
          <Link to={`/receipts/${receipt.id}/edit`} className="menu-item" onClick={() => setOpen(false)}>Edit receipt</Link>
          <button type="button" className="menu-item danger" onClick={handleDelete}>Delete receipt</button>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage({ receipts, onDelete }) {
  return (
    <section className="panel-stack">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Saved receipts</p>
          <h2>Recent receipts</h2>
        </div>
        <Link className="primary-button" to="/receipts/new">Create receipt</Link>
      </div>

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
              <ReceiptActions receipt={receipt} onDelete={onDelete} />
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
  );
}
