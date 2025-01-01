import { CartItem, Product } from './interfaces';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateUniqueId(list: CartItem[] | Product[]): number {
  const existingIds = new Set(list.map((cart) => cart.id));
  let newId = 1;
  while (existingIds.has(newId)) {
    newId++;
  }
  return newId;
}
