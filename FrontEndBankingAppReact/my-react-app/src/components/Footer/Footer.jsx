import React from 'react';

const Footer = () => (
  <footer data-testid="Footer" style={styles.footer}>
    <span>© 2026 ApexBank. Secure banking for modern life.</span>
    <span>Support • Privacy • Terms</span>
  </footer>
);

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    color: '#6b7280',
    fontSize: '0.95rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
};

export default Footer;
