import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ServicesPage from './pages/ServicesPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ResultsPage from './pages/ResultsPage';
import Accounts from './pages/AccountPage';

function App() {
  
  const [currentPage, setCurrentPage] = useState('home')

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

    //Homepage fallback
    return <HomePage />
  };


  return (
    <div style={styles.container}>
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <main style={styles.pageContent}>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

// Cleaned-Up Styling Object (Removed unused card/dashboard grid layout styles)
const styles = {
  container: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
    color: '#1F2937',
  },
  pageContent: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem 2rem',
  },
};

export default App;