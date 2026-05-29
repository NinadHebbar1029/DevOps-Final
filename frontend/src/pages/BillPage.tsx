import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bill, createBill, fetchBills, fetchMenu, MenuItem } from '../api';

function BillPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [latestBill, setLatestBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setError('');
      setLoading(true);
      const [menuItems, bills] = await Promise.all([fetchMenu(), fetchBills()]);
      setMenu(menuItems);
      if (menuItems.length > 0 && selectedItemIds.length === 0) {
        setSelectedItemIds([menuItems[0].id]);
      }
      setLatestBill(bills[0] ?? null);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const selectedItems = useMemo(
    () => menu.filter((item) => selectedItemIds.includes(item.id)),
    [menu, selectedItemIds]
  );

  const totalAmount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );

  function toggleItem(itemId: number) {
    setSelectedItemIds((current) =>
      current.includes(itemId) ? current.filter((value) => value !== itemId) : [...current, itemId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedCustomerName = customerName.trim();
    if (!cleanedCustomerName) {
      setError('Enter the customer name to generate a bill.');
      return;
    }

    if (selectedItemIds.length === 0) {
      setError('Select at least one food item to generate a bill.');
      return;
    }

    try {
      setError('');
      const bill = await createBill(cleanedCustomerName, selectedItemIds);
      setLatestBill(bill);
      setCustomerName('');
      setSelectedItemIds(menu.length > 0 ? [menu[0].id] : []);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unexpected error';
      setError(message);
    }
  }

  return (
    <section className="page-grid two-column-layout">
      <div className="panel form-panel">
        <div className="section-heading">
          <span className="feature-kicker">Bill page</span>
          <h1>Create a customer bill</h1>
          <p>Choose the items, enter the guest name, and generate a clean invoice.</p>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Customer name</span>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter customer name"
              aria-label="Customer name"
            />
          </label>

          <div className="menu-grid compact">
            {menu.map((item) => (
              <label
                key={item.id}
                className={selectedItemIds.includes(item.id) ? 'menu-card selected' : 'menu-card'}
              >
                <input
                  type="checkbox"
                  checked={selectedItemIds.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.name}</span>
                <strong>₹{item.price}</strong>
              </label>
            ))}
          </div>

          <div className="bill-preview">
            <span>Selected items: {selectedItems.length}</span>
            <strong>Total: ₹{totalAmount}</strong>
          </div>

          <button type="submit" className="primary-button">
            Generate bill
          </button>
        </form>

        {error ? <p className="inline-error">{error}</p> : null}
      </div>

      <aside className="panel receipt-panel">
        <div className="section-heading">
          <span className="feature-kicker">Invoice preview</span>
          <h2>{loading ? 'Loading...' : latestBill ? `Bill #${latestBill.id}` : 'No bill generated yet'}</h2>
        </div>

        {latestBill ? (
          <article className="receipt-card">
            <div className="receipt-head">
              <div>
                <small>Customer</small>
                <strong>{latestBill.customerName}</strong>
              </div>
              <div>
                <small>Date</small>
                <strong>{new Date(latestBill.createdAt).toLocaleString()}</strong>
              </div>
            </div>

            <ul className="bill-list">
              {latestBill.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>

            <div className="bill-total">Grand total: ₹{latestBill.totalAmount}</div>
          </article>
        ) : (
          <div className="empty-state">
            <p>Select items and generate a bill to see the invoice preview here.</p>
          </div>
        )}
      </aside>
    </section>
  );
}

export default BillPage;