import { NextResponse } from 'next/server';

const inventory = [
  {
    id: 1,
    name: 'MacBook Pro',
    category: 'Laptops',
    stock: 12,
    price: 2400,
    sku: 'MBP-2024',
  },
  {
    id: 2,
    name: 'iPhone 15',
    category: 'Phones',
    stock: 34,
    price: 1200,
    sku: 'IPH-15',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    category: 'Accessories',
    stock: 58,
    price: 320,
    sku: 'APP-2',
  },
  {
    id: 4,
    name: 'Dell XPS 13',
    category: 'Laptops',
    stock: 8,
    price: 1800,
    sku: 'DX13-2024',
  },
  {
    id: 5,
    name: 'Samsung Galaxy S24',
    category: 'Phones',
    stock: 27,
    price: 1100,
    sku: 'SGS24',
  },
  {
    id: 6,
    name: 'Logitech MX Master 3',
    category: 'Accessories',
    stock: 45,
    price: 100,
    sku: 'LMM3',
  },            
  {
    id: 7,
    name: 'Asus ROG Zephyrus',
    category: 'Laptops',
    stock: 5,
    price: 2200,
    sku: 'ARZ-2024',
  },
  {
    id: 8,
    name: 'Google Pixel 8',
    category: 'Phones',
    stock: 30,
    price: 900,
    sku: 'GP8',
  },
  {
    id: 9,
    name: 'Sony WH-1000XM5',
    category: 'Accessories',
    stock: 40,
    price: 350,
    sku: 'SWH1000XM5',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = (searchParams.get("search") || "").toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  let filtered = inventory;

  if (search) {
    filtered = inventory.filter((c) => {
      return (
        c.name.toLowerCase().includes(search) ||
        c.sku.toLowerCase().includes(search)
      );
    });
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ data, total });
}
