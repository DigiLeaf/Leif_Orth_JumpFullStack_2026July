import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';


export default function Accounts() {
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Search/Admin State
  const [searchId, setSearchId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);


  //User boilerplate info
  const [balance, setBalance] = useState(5420.50);
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Grocery Store', category: 'Food', amount: -65.20, date: '2026-07-14' },
    { id: 2, description: 'Paycheck Direct Deposit', category: 'Income', amount: 2500.00, date: '2026-07-12' },
    { id: 3, description: 'Electric Utility', category: 'Bills', amount: -120.00, date: '2026-07-10' },
    { id: 4, description: 'Streaming Service', category: 'Entertainment', amount: -14.99, date: '2026-07-08' },
  ]);
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');



  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setAccounts([]);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      const token = data.access_token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      setUser({
        name: decoded.sub,
        role: decoded.role
      });

      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGetAccountById = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError('');
    setAccounts([]);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
      const token = localStorage.getItem('token'); // <-- Grab JWT from localStorage

      const response = await fetch(`${baseUrl}/api/accounts/${searchId.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- Send token in the headers!
        }
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Session expired. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('Forbidden: Only admins can view individual accounts.');
      }
      if (response.status === 404) {
        throw new Error(`Account ID "${searchId}" not found.`);
      }
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const normalizedData = Array.isArray(data) ? data : [data];
      setAccounts(normalizedData);
    } catch (err) {
      setAccounts([]);
      setError(err.message || 'Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAccounts([]);
    setSearchId('');
    setError('');
  };
    const handleTransfer = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);

    if (!transferRecipient || isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid recipient and amount.');
      return;
    }

    if (amountNum > balance) {
      alert('Insufficient funds!');
      return;
    }

    setBalance((prev) => prev - amountNum);
    const newTransaction = {
      id: Date.now(),
      description: `Transfer to ${transferRecipient}`,
      category: 'Transfer',
      amount: -amountNum,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setTransferRecipient('');
    setTransferAmount('');
    alert('Transfer successful!');
  };

  return (
  <div style={{...styles.wrapper, maxWidth: user ? '1200px' : '700px'}}>
    {/* 1. HERO HEADER */}
    <div style={styles.hero}>
      <p style={styles.eyebrow}>Secure Gateway</p>
      <h1 style={styles.title}>Account Sign In</h1>
      <p style={styles.subtitle}>
        Sign in to access more features and view your account.
      </p>
    </div>

    {/* 2. AUTHENTICATION LOGIC */}
    {!user ? (
      // --- LOGIN FORM (UNAUTHENTICATED) ---
      <div style={styles.resultsContainer}>
        <h2 style={styles.resultsTitle}>Sign In</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={styles.formGroup}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Username</label>
            <input
              type="text"
              placeholder="e.g. admin or alice_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <button type="submit" style={{ ...styles.actionButton, width: '100%' }}>
            Login
          </button>
        </form>

        {error && <p style={styles.errorText}>{error}</p>}
      </div>
    ) : (
      // --- PORTAL VIEW (AUTHENTICATED) ---
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        
        {/* User Profile Card */}
        <div style={styles.resultsContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, color: '#111827' }}>Welcome, {user.name}!</h2>
              {user.role === 'ROLE_ADMIN' ? (
                <span style={styles.badgeAdmin}>ROLE_ADMIN</span>
              ) : (
                <span style={styles.badgeUser}>ROLE_USER</span>
              )}
            </div>
            <button 
              onClick={handleLogout} 
              style={{ ...styles.actionButton, backgroundColor: '#4b5563' }}
            >
              Logout
            </button>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {/* --- DYNAMIC MODULE RENDERING BASED ON ROLE --- */}
        {user.role === 'ROLE_ADMIN' ? (
          // --- ADMIN VIEW: SEARCH & TABLES ---
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Account Search ID Box */}
            <div style={styles.resultsContainer}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>Search Account by ID</h3>
              <form onSubmit={handleGetAccountById} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Enter Account ID (e.g., 101)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !searchId.trim()}
                  style={{
                    ...styles.actionButton,
                    padding: '0.75rem 1.5rem',
                    opacity: (!searchId.trim() || loading) ? 0.6 : 1,
                    cursor: (!searchId.trim() || loading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {/* Accounts Table Results */}
            {accounts.length > 0 && (
              <div style={styles.resultsContainer}>
                <h3 style={styles.resultsTitle}>Account Search Results</h3>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>_id</th>
                        <th style={styles.tableHeader}>Account Number</th>
                        <th style={styles.tableHeader}>Balance</th>
                        <th style={styles.tableHeader}>Account Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acc, index) => {
                        const id = acc?.id ?? acc?._id ?? '';
                        const accNumber = acc?.account_number ?? '';
                        const balance = acc?.balance !== undefined ? `$${acc.balance.toFixed(2)}` : '$0.00';
                        const accType = acc?.account_type ?? '';

                        return (
                          <tr key={id || index}>
                            <td style={styles.tableCell}>{id}</td>
                            <td style={styles.tableCell}>{accNumber}</td>
                            <td style={styles.tableCell}>{balance}</td>
                            <td style={styles.tableCell}>{accType}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          // --- STANDARD USER VIEW: INTERACTIVE DASHBOARD ---
          <div style={styles.dashboardGrid}>
            
            {/* Left Column: Balance Metric Card & Quick Transfer Action Panel */}
            <section style={styles.leftCol}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Total Balance</h2>
                <p style={styles.balanceText}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p style={styles.cardSubtitle}>Checking Account •••• 4820</p>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Quick Transfer</h2>
                <form onSubmit={handleTransfer} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Recipient Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jane Smith" 
                      value={transferRecipient}
                      onChange={(e) => setTransferRecipient(e.target.value)}
                      style={styles.input} 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      style={styles.input} 
                    />
                  </div>
                  <button type="submit" style={styles.primaryBtn}>Send Money</button>
                </form>
              </div>
            </section>

            {/* Right Column: Historical Ledger Array */}
            <section style={styles.rightCol}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Recent Transactions</h2>
                <div style={styles.transactionList}>
                  {transactions.map((tx) => {
                    const isNegative = tx.amount < 0;
                    return (
                      <div key={tx.id} style={styles.transactionItem}>
                        <div>
                          <p style={styles.txDesc}>{tx.description}</p>
                          <span style={styles.txMeta}>{tx.date} • {tx.category}</span>
                        </div>
                        <span style={{ 
                          ...styles.txAmount, 
                          color: isNegative ? '#EF4444' : '#10B981' 
                        }}>
                          {isNegative ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    )}
  </div>
);
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem 0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '700px',
    margin: '0 auto',
  },
  hero: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderRadius: '1rem',
    padding: '2rem',
  },
  eyebrow: {
    margin: 0,
    color: '#2563eb',
    fontSize: '0.875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: '0.5rem 0',
    fontSize: '2rem',
    color: '#111827',
  },
  subtitle: {
    margin: '0 0 1rem',
    color: '#4b5563',
    maxWidth: '700px',
    lineHeight: 1.6,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  errorText: {
    color: '#dc2626',
    margin: '0.5rem 0',
    fontWeight: 500,
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  resultsTitle: {
    margin: '0 0 0.5rem',
    color: '#111827',
    fontSize: '1.1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontWeight: 600,
  },
  tableCell: {
    padding: '0.75rem',
    borderBottom: '1px solid #f3f4f6',
    color: '#4b5563',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  badgeAdmin: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: '#fef3c7',
    color: '#d97706',
    marginTop: '0.5rem',
  },
  badgeUser: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    marginTop: '0.5rem',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1rem',
  },
  cardSubtitle: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.5rem',
  },
  balanceText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#111827',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4B5563',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #F3F4F6',
  },
  txDesc: {
    fontWeight: '500',
    fontSize: '1rem',
    margin: 0,
  },
  txMeta: {
    fontSize: '0.8125rem',
    color: '#9CA3AF',
  },
  txAmount: {
    fontWeight: '600',
    fontSize: '1rem',
  }
};
