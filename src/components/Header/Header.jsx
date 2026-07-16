import React from 'react';

function Header({ onNavigate, currentPage }) {
  const menuItems = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Accounts', value: 'accounts' },
    { label: 'Contact', value: 'contact' },
    { label: 'Results', value: 'results' }, // Added Support menu item
  ];

  return (
    <header style={styles.navbar}>
      <div style={styles.logo} onClick={() => onNavigate?.('home')}>
        ApexBank
      </div>
      <nav style={styles.menu}>
        {menuItems.map((item) => {
          const isActive = currentPage === item.value;

          return (
            <a
              key={item.value}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(item.value);
              }}
              style={isActive ? styles.activeLink : styles.navLink}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <div style={styles.userProfile}>
        <div style={styles.avatar}>JD</div>
        <span style={styles.userName}>John Doe</span>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#2563eb',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#4b5563',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  activeLink: {
    color: '#2563eb',
    fontWeight: '600',
    borderBottom: '2px solid #2563eb',
    paddingBottom: '0.25rem',
    textDecoration: 'none',
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
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#4b5563',
  },
  userName: {
    fontWeight: '500',
  },
};

export default Header;