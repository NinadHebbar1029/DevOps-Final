export type MenuItem = {
  id: number;
  name: string;
  price: number;
};

export type BillItem = {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Bill = {
  id: number;
  customerName: string;
  items: BillItem[];
  totalAmount: number;
  createdAt: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch(`${apiBaseUrl}/api/bills/menu`);
  if (!response.ok) {
    throw new Error('Unable to load menu');
  }
  const payload = (await response.json()) as { items: MenuItem[] };
  return payload.items;
}

export async function fetchBills(): Promise<Bill[]> {
  const response = await fetch(`${apiBaseUrl}/api/bills`);
  if (!response.ok) {
    throw new Error('Unable to load bills');
  }
  const payload = (await response.json()) as { items: Bill[] };
  return payload.items;
}

export async function createBill(customerName: string, itemIds: number[]): Promise<Bill> {
  const response = await fetch(`${apiBaseUrl}/api/bills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ customerName, itemIds })
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? 'Unable to create bill');
  }

  const payload = (await response.json()) as { item: Bill };
  return payload.item;
}

export async function clearBillHistory(): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/bills`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Unable to clear bill history');
  }
}