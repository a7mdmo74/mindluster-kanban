
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { tasks: [] }; // Return empty tasks if db.json doesn't exist
    }
    throw error;
  }
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const newTask = { ...body, id: Math.random().toString(36).substring(2, 8) };
  db.tasks.push(newTask);
  await writeDb(db);
  return NextResponse.json(newTask);
}
