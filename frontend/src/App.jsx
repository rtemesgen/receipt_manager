import { Navigate, Route, Routes, useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { apiRequest } from './lib/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReceiptFormPage from './pages/ReceiptFormPage';
import SettingsPage from './pages/SettingsPage';
import ReceiptPreviewPage from './pages/ReceiptPreviewPage';

const authStorageKey = 'receipt-manager-auth';

function readStoredAuth() {
  const raw = localStorage.getItem(authStorageKey);
  return raw ? JSON.parse(raw) : null;
}

function ProtectedRoute({ auth, children }) {
  const location = useLocation();
  if (!auth?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function Shell({ auth, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell compact-shell">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Receipt Manager</p>
          <h1 className="topbar-title">Store receipts with your brand built in.</h1>
        </div>
        <div className="topbar-actions" ref={menuRef}>
          <p className="muted topbar-user">{auth.fullName}</p>
          <div className="topbar-menu-wrap">
            <button
              type="button"
              className="hamburger-button"
              aria-label="Open options menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
            {menuOpen ? (
              <div className="topbar-dropdown">
                <Link to="/" onClick={closeMenu}>Receipts</Link>
                <Link to="/receipts/new" onClick={closeMenu}>New Receipt</Link>
                <Link to="/settings" onClick={closeMenu}>Settings</Link>
                <button
                  type="button"
                  className="dropdown-logout"
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="content content-with-topbar">{children}</main>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [settings, setSettings] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(Boolean(readStoredAuth()?.token));

  useEffect(() => {
    if (!auth?.token) {
      setSettings(null);
      setReceipts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      apiRequest('/settings', { token: auth.token }),
      apiRequest('/receipts', { token: auth.token })
    ])
      .then(([settingsData, receiptsData]) => {
        if (cancelled) {
          return;
        }
        setSettings(settingsData);
        setReceipts(receiptsData);
      })
      .catch(() => {
        if (!cancelled) {
          handleLogout();
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
  }, [auth?.token]);

  function persistAuth(nextAuth) {
    setAuth(nextAuth);
    if (nextAuth) {
      localStorage.setItem(authStorageKey, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(authStorageKey);
    }
  }

  function handleAuthSuccess(payload) {
    persistAuth(payload);
    navigate('/');
  }

  function handleLogout() {
    persistAuth(null);
    navigate('/login');
  }

  async function refreshReceipts() {
    if (!auth?.token) return [];
    const data = await apiRequest('/receipts', { token: auth.token });
    setReceipts(data);
    return data;
  }

  async function refreshSettings() {
    if (!auth?.token) return;
    const data = await apiRequest('/settings', { token: auth.token });
    setSettings(data);
  }

  async function deleteReceipt(id) {
    await apiRequest(`/receipts/${id}`, { method: 'DELETE', token: auth.token });
    const updated = await refreshReceipts();
    return updated;
  }

  if (loading) {
    return <div className="page-center">Loading your workspace...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onSuccess={handleAuthSuccess} />} />
      <Route path="/register" element={<RegisterPage onSuccess={handleAuthSuccess} />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute auth={auth}>
            <Shell auth={auth} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<DashboardPage receipts={receipts} onDelete={deleteReceipt} />} />
                <Route path="/receipts/new" element={<ReceiptFormPage auth={auth} onSaved={refreshReceipts} />} />
                <Route path="/receipts/:id/edit" element={<ReceiptFormPage auth={auth} onSaved={refreshReceipts} />} />
                <Route path="/settings" element={<SettingsPage auth={auth} settings={settings} onUpdated={refreshSettings} />} />
                <Route path="/receipts/:id" element={<ReceiptPreviewPage auth={auth} onDelete={deleteReceipt} />} />
              </Routes>
            </Shell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
