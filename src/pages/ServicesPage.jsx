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
      </div>

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
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  hero: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
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
    margin: 0,
    color: '#4b5563',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
    margin: 0,
  },
  cardText: {
    color: '#4b5563',
    lineHeight: 1.5,
    margin: 0,
  },
};

export default ServicesPage;
