const quickActions = ['Transfer', 'Pay Bills', 'Deposit', 'Support']

const transactions = [
  { title: 'Groceries', amount: '-$84.20', time: 'Today · 6:42 PM' },
  { title: 'Salary Deposit', amount: '+$3,250.00', time: 'Today · 9:00 AM' },
  { title: 'Online Shopping', amount: '-$129.99', time: 'Yesterday · 8:10 PM' },
]

function HomePage() {
  return (
    <div className="bank-app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Northstar Bank</p>
          <h1>Welcome back, Jordan</h1>
        </div>
        <button type="button" className="primary-btn">
          + New Transfer
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="card hero-card">
          <div className="card-header">
            <p className="eyebrow">Primary account</p>
            <span className="pill">Active</span>
          </div>
          <h2>$24,580.00</h2>
          <p className="muted">•••• 4821 · Checking</p>
          <div className="hero-actions">
            <button type="button" className="primary-btn">
              View Details
            </button>
            <button type="button" className="secondary-btn">
              Download Statement
            </button>
          </div>
        </section>

        <section className="card summary-card">
          <div className="card-header">
            <p className="eyebrow">Savings</p>
            <span className="pill accent">+4.8%</span>
          </div>
          <h3>$8,240.00</h3>
          <p className="muted">Auto-save enabled for your emergency fund.</p>
        </section>

        <section className="card actions-card">
          <div className="card-header">
            <p className="eyebrow">Quick actions</p>
          </div>
          <div className="actions-grid">
            {quickActions.map((item) => (
              <button key={item} type="button" className="action-btn">
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="card transactions-card">
          <div className="card-header">
            <p className="eyebrow">Recent transactions</p>
            <a href="#">See all</a>
          </div>
          <ul>
            {transactions.map((item) => (
              <li key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{item.time}</p>
                </div>
                <span className={item.amount.startsWith('+') ? 'positive' : 'negative'}>
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card goals-card">
          <div className="card-header">
            <p className="eyebrow">Goals</p>
          </div>
          <h3>Vacation fund</h3>
          <p className="muted">You are 68% toward your $5,000 target this year.</p>
          <div className="progress-bar" aria-label="Goal progress">
            <span></span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
