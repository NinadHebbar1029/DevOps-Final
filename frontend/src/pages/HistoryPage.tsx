import { useEffect, useState } from 'react';
import { Bill, clearBillHistory, fetchBills } from '../api';

function HistoryPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBills() {
    try {
      setError('');
      setLoading(true);
      const billItems = await fetchBills();
      setBills(billItems);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBills();
  }, []);

  async function handleClearHistory() {
    try {
      setError('');
      await clearBillHistory();
      setBills([]);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unexpected error';
      setError(message);
    }
  }

  return (
    <section className="page-grid history-layout">
      <div className="panel">
        <div className="section-heading history-head">
          <span className="feature-kicker">History page</span>
          <div>
            <h1>Billing history</h1>
            <p>Review past customer bills and clear the ledger whenever needed.</p>
          </div>
          <button type="button" className="secondary-button" onClick={handleClearHistory}>
            Clear history
          </button>
        </div>

        {error ? <p className="inline-error">{error}</p> : null}

        {loading ? (
          <div className="empty-state">Loading bill history...</div>
        ) : bills.length === 0 ? (
          <div className="empty-state">No bills have been generated yet.</div>
        ) : (
          <div className="history-list">
            {bills.map((bill) => (
              <article key={bill.id} className="history-card">
                <div className="history-card-head">
                  <div>
                    <small>Customer</small>
                    <strong>{bill.customerName}</strong>
                  </div>
                  <div>
                    <small>Total</small>
                    <strong>₹{bill.totalAmount}</strong>
                  </div>
                </div>

                <ul>
                  {bill.items.map((item) => (
                    <li key={item.id}>
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </li>
                  ))}
                </ul>

                <small>{new Date(bill.createdAt).toLocaleString()}</small>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HistoryPage;