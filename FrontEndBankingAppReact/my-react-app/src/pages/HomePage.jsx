import React from 'react';

function HomePage() {
  const highlights = [
    '24/7 online and mobile banking access',
    'Secure card controls and instant transfers',
    'Personalized savings and investment guidance',
  ];

  return (
    <section style={styles.wrapper}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>Welcome to ApexBank</p>
        <h1 style={styles.title}>Banking that feels modern, simple, and secure.</h1>
        <p style={styles.subtitle}>
          We help you manage everyday spending, grow your savings, and plan for the future with confidence.
        </p>
      </div>

      <div style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>About ApexBank</h2>
          <p style={styles.cardText}>
            ApexBank is a trusted financial partner offering digital-first banking experiences for individuals,
            families, and growing businesses. Our mission is to make money movement, saving, and planning feel effortless.
          </p>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Why customers choose us</h2>
          <ul style={styles.list}>
            {highlights.map((item) => (
              <li key={item} style={styles.listItem}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1rem 0 2rem',
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
    color: '#111827',
    fontSize: '2rem',
  },
  subtitle: {
    margin: 0,
    color: '#4b5563',
    maxWidth: '720px',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
  },
  cardTitle: {
    margin: '0 0 0.75rem',
    color: '#111827',
    fontSize: '1.1rem',
  },
  cardText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.6,
  },
  list: {
    margin: 0,
    paddingLeft: '1.1rem',
    color: '#4b5563',
    lineHeight: 1.8,
  },
  listItem: {
    marginBottom: '0.35rem',
  },
};

export default HomePage;
