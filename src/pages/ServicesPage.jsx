import React, { useState } from 'react';

function ServicesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [accounts, setAccounts] = useState([]);

  const services = [
    {
      title: 'Personal Checking',
      description: 'Manage everyday spending with instant transfers and smart insights.',
    },
    {
      title: 'Savings Goals',
      description: 'Build your future with automated savings buckets and high-yield options.',
    },
    {
      title: 'Wealth Planning',
      description: 'Get guidance for retirement, investments, and long-term financial security.',
    },
  ];

  const handleGetAllCustomers = async () => {
    setLoading(true);
    setError('');
    setAccounts([]);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
      const endpoints = [
        `${baseUrl}/users`,
        ,

      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const data = await response.json();
          const normalizedCustomers = Array.isArray(data)
            ? data
            : Array.isArray(data?.customers)
              ? data.customers
              : Array.isArray(data?.data)
                ? data.data
                : [];

          setCustomers(normalizedCustomers);
          return;
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error('Unable to reach the customers API.');
    } catch (err) {
      setCustomers([]);
      setError(err.message || 'Something went wrong while loading customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllAccounts = async () => {
    setLoading(true);
    setError('');
    setCustomers([]); 

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
      // Change the path to match the GET /accounts endpoint we just created
      const response = await fetch(`${baseUrl}/api/accounts`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize incoming array format safely
      const normalizedAccounts = Array.isArray(data) 
        ? data 
        : Array.isArray(data?.accounts) 
          ? data.accounts 
          : [];

      setAccounts(normalizedAccounts);
    } catch (err) {
      setAccounts([]);
      setError(err.message || 'Something went wrong while loading accounts.');
    } finally {
      setLoading(false);
    }
  };
  

  const getCustomerLabel = (customer) => {
    if (typeof customer === 'string') {
      return customer;
    }

    if (customer?.name) {
      return customer.name;
    }

    if (customer?.customer_name) {
      return customer.customer_name;
    }

    if (customer?.first_name || customer?.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    }

    if (customer?.email) {
      return customer.email;
    }

    return `Customer ${customer?.id ?? ''}`.trim();
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>Banking services</p>
        <h1 style={styles.title}>Everything you need to grow with confidence</h1>
        <p style={styles.subtitle}>
          Explore flexible products built for modern banking, from everyday spending to long-term planning.
        </p>
        
        {/* Container to hold both operations */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            style={styles.actionButton}
            type="button"
            onClick={handleGetAllCustomers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'GetAllCustomers'}
          </button>

          {/* 3. Add a button to trigger the fresh account call */}
          <button
            style={styles.actionButton}
            type="button"
            onClick={handleGetAllAccounts}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'GetAllAccounts'}
          </button>
        </div>
      </div>

      {error ? <p style={styles.errorText}>{error}</p> : null}

      {/* Existing Customer Table Block (Unchanged) */}
      {customers.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsTitle}>Customer Results</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Email</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => {
                  const customerId = customer?.id ?? customer?.customer_id ?? customer?.CustomerID ?? '';
                  const firstName = customer?.first_name || '';
                  const lastName = customer?.last_name || '';
                  const customerName = customer?.name ?? customer?.customer_name ?? (firstName || lastName ? `${firstName} ${lastName}`.trim() : getCustomerLabel(customer));
                  const customerEmail = customer?.email ?? customer?.customer_email ?? '';
                  return (
                    <tr key={customerId || index}>
                      <td style={styles.tableCell}>{customerId}</td>
                      <td style={styles.tableCell}>{customerName}</td>
                      <td style={styles.tableCell}>{customerEmail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Add the brand new Accounts Table matching your payload architecture */}
      {accounts.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsTitle}>Account Results</h3>
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
                  // Safely fall back to object structure sent by your Python to_dict() layer
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

      {/* Empty Fallback */}
      {!loading && customers.length === 0 && accounts.length === 0 && (
        <p style={styles.emptyState}>No data loaded yet.</p>
      )}

      <div style={styles.grid}>
        {services.map((service) => (
          <article key={service.title} style={styles.card}>
            <h2 style={styles.cardTitle}>{service.title}</h2>
            <p style={styles.cardText}>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem 0',
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
    margin: 0,
    fontWeight: 500,
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
  },
  resultsTitle: {
    margin: '0 0 1rem',
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
  emptyState: {
    margin: 0,
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
  },
  cardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.1rem',
    color: '#111827',
  },
  cardText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.6,
  },
};

export default ServicesPage;
