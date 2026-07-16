import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ServicesPage from './pages/ServicesPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ResultsPage from './pages/ResultsPage';
import Accounts from './pages/AccountPage';

function App() {
  // Mock State for the dashboard
  const [balance, setBalance] = useState(5420.50);
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Grocery Store', category: 'Food', amount: -65.20, date: '2026-07-14' },
    { id: 2, description: 'Paycheck Direct Deposit', category: 'Income', amount: 2500.00, date: '2026-07-12' },
    { id: 3, description: 'Electric Utility', category: 'Bills', amount: -120.00, date: '2026-07-10' },
    { id: 4, description: 'Streaming Service', category: 'Entertainment', amount: -14.99, date: '2026-07-08' },
  ]);

  // Form states for Quick Transfer
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    if (currentPage === 'services') {
      return <ServicesPage />;
    }

    if (currentPage === 'contact') {
      return <ContactPage />;
    }

    if (currentPage === 'home') {
      return <HomePage />;
    }
    if (currentPage === 'results') {
      return <ResultsPage />;
    }
    if (currentPage === 'accounts'){
      return <Accounts />;
    }

    return (
      <>
        <section style={styles.leftCol}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Total Balance</h2>
            <p style={styles.balanceText}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
      </>
    );
  };

  // Handle transferring money
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

    // Update Balance
    setBalance((prev) => prev - amountNum);

    // Add to Transaction History
    const newTransaction = {
      id: Date.now(),
      description: `Transfer to ${transferRecipient}`,
      category: 'Transfer',
      amount: -amountNum,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Clear inputs
    setTransferRecipient('');
    setTransferAmount('');
    alert('Transfer successful!');
  };

  return (
    <div style={styles.container}>
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <main style={currentPage === 'services' ? styles.pageContent : styles.dashboardGrid}>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

// Styling Object
const styles = {
  container: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
    color: '#1F2937',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#2563EB', // Classic Bank Blue
  },
  menu: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#4B5563',
    fontWeight: '500',
    cursor: 'pointer',
  },
  activeLink: {
    color: '#2563EB',
    fontWeight: '600',
    borderBottom: '2px solid #2563EB',
    paddingBottom: '0.25rem',
    cursor: 'pointer',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#4B5563',
  },
  userName: {
    fontWeight: '500',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  pageContent: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem 2rem',
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
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
    outline: 'none',
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
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
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
  },
};

export default App;