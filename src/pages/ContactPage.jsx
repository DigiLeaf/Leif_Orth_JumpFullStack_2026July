import React from 'react';

function ContactPage() {
  const contacts = [
    { label: 'Customer Support', value: '1-800-555-0148' },
    { label: 'Email', value: 'support@apexbank.com' },
    { label: 'Address', value: '400 Market Street, Suite 600, San Francisco, CA' },
    { label: 'Hours', value: 'Mon-Fri: 8:00 AM - 8:00 PM' },
  ];

  return (
    <section style={styles.wrapper}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>Contact us</p>
        <h1 style={styles.title}>We’re here to help with your banking needs.</h1>
        <p style={styles.subtitle}>
          Reach out to our team for account support, service questions, or help with online banking.
        </p>
      </div>

      <div style={styles.cardGrid}>
        {contacts.map((contact) => (
          <article key={contact.label} style={styles.card}>
            <h2 style={styles.cardTitle}>{contact.label}</h2>
            <p style={styles.cardText}>{contact.value}</p>
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
    padding: '1rem 0 2rem',
  },
  hero: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '1rem',
    padding: '2rem',
  },
  eyebrow: {
    margin: 0,
    color: '#b45309',
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
    maxWidth: '700px',
    lineHeight: 1.6,
  },
  cardGrid: {
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
    color: '#111827',
    fontSize: '1.1rem',
  },
  cardText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.6,
  },
};

export default ContactPage;
