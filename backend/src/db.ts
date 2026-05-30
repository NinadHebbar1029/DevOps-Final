import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { config } from './config';

type BillRow = RowDataPacket & {
  id: number;
  customer_name: string;
  total_amount: number;
  created_at: Date;
};

type BillItemRow = RowDataPacket & {
  item_id: number;
  bill_id: number;
  menu_item_id: number;
  item_name: string;
  price: number;
  quantity: number;
};

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

export type CreateBillInput = {
  customerName: string;
  itemIds: number[];
};

const menuItems: MenuItem[] = [
  { id: 1, name: 'Margherita Pizza', price: 220 },
  { id: 2, name: 'Veg Burger', price: 120 },
  { id: 3, name: 'Paneer Wrap', price: 150 },
  { id: 4, name: 'Fried Rice', price: 180 },
  { id: 5, name: 'Pasta Alfredo', price: 200 },
  { id: 6, name: 'Masala Dosa', price: 110 }
];

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: 10
});

let databaseAvailable = true;
let nextBillId = 1;
let nextBillItemId = 1;
const inMemoryBills: Bill[] = [];

function calculateBill(customerName: string, itemIds: number[]): Bill {
  const selectedItems = itemIds
    .map((itemId) => menuItems.find((item) => item.id === itemId))
    .filter((item): item is MenuItem => Boolean(item));

  if (selectedItems.length === 0) {
    throw new Error('Select at least one food item');
  }

  const items: BillItem[] = selectedItems.map((item) => ({
    id: nextBillItemId++,
    menuItemId: item.id,
    name: item.name,
    price: item.price,
    quantity: 1
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: nextBillId++,
    customerName,
    items,
    totalAmount,
    createdAt: new Date().toISOString()
  };
}

export function getMenuItems(): MenuItem[] {
  return menuItems;
}

export async function initDatabase() {
  try {
    // Ensure the database itself exists. Connect without specifying a database and create it if missing.
    try {
      const adminPool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        connectionLimit: 1
      });

      await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${config.database.database}\``);
      await adminPool.end();
    } catch (dbCreateError) {
      // ignore errors here; the following table creation will surface connection issues
      console.warn('Could not ensure database exists:', dbCreateError instanceof Error ? dbCreateError.message : dbCreateError);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bill_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bill_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
      )
    `);
    databaseAvailable = true;
  } catch (error) {
    databaseAvailable = false;
    console.warn('MySQL is unavailable, using in-memory storage for local runs.');
    console.warn(error instanceof Error ? error.message : error);
  }
}

export async function pingDatabase() {
  if (!databaseAvailable) {
    return false;
  }

  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    databaseAvailable = false;
    return false;
  }
}

export async function listBills(): Promise<Bill[]> {
  if (!databaseAvailable) {
    return [...inMemoryBills];
  }

  const [rows] = await pool.query<(BillRow & BillItemRow)[]>(`
    SELECT
      b.id AS id,
      b.customer_name,
      b.total_amount,
      b.created_at,
      bi.id AS item_id,
      bi.menu_item_id,
      bi.item_name,
      bi.price,
      bi.quantity
    FROM bills b
    LEFT JOIN bill_items bi ON bi.bill_id = b.id
    ORDER BY b.created_at DESC, bi.id ASC
  `);

  const billMap = new Map<number, Bill>();

  for (const row of rows) {
    const existingBill = billMap.get(row.id);

    if (!existingBill) {
      billMap.set(row.id, {
        id: row.id,
        customerName: row.customer_name,
        items: [],
        totalAmount: Number(row.total_amount),
        createdAt: row.created_at.toISOString()
      });
    }

    if (row.item_id !== null && row.item_id !== undefined) {
      billMap.get(row.id)?.items.push({
        id: row.item_id,
        menuItemId: row.menu_item_id,
        name: row.item_name,
        price: Number(row.price),
        quantity: row.quantity
      });
    }
  }

  return [...billMap.values()];
}

export async function createBill(input: CreateBillInput): Promise<Bill> {
  const customerName = input.customerName.trim();

  if (!customerName) {
    throw new Error('Customer name is required');
  }

  const bill = calculateBill(customerName, input.itemIds);

  if (!databaseAvailable) {
    inMemoryBills.unshift(bill);
    return bill;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [billResult] = await connection.execute<ResultSetHeader>(
      'INSERT INTO bills (customer_name, total_amount) VALUES (?, ?)',
      [bill.customerName, bill.totalAmount]
    );

    for (const item of bill.items) {
      await connection.execute(
        'INSERT INTO bill_items (bill_id, menu_item_id, item_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [billResult.insertId, item.menuItemId, item.name, item.price, item.quantity]
      );
    }

    await connection.commit();

    return {
      ...bill,
      id: billResult.insertId
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function clearBillHistory() {
  if (!databaseAvailable) {
    inMemoryBills.length = 0;
    return;
  }

  await pool.query('DELETE FROM bill_items');
  await pool.query('DELETE FROM bills');
}