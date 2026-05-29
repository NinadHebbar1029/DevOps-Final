import { Router } from 'express';
import { clearBillHistory, createBill, getMenuItems, listBills } from '../db';

export const billsRouter = Router();

billsRouter.get('/menu', async (_request, response, next) => {
  try {
    response.json({ items: getMenuItems() });
  } catch (error) {
    next(error);
  }
});

billsRouter.get('/', async (_request, response, next) => {
  try {
    const items = await listBills();
    response.json({ items });
  } catch (error) {
    next(error);
  }
});

billsRouter.post('/', async (request, response, next) => {
  try {
    const customerName = String(request.body?.customerName ?? '').trim();
    const itemIds = Array.isArray(request.body?.itemIds)
      ? request.body.itemIds.map((value: unknown) => Number(value)).filter((value: number) => Number.isFinite(value))
      : [];

    if (!customerName) {
      response.status(400).json({ message: 'Customer name is required' });
      return;
    }

    const item = await createBill({ customerName, itemIds });
    response.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

billsRouter.delete('/', async (_request, response, next) => {
  try {
    await clearBillHistory();
    response.json({ cleared: true });
  } catch (error) {
    next(error);
  }
});