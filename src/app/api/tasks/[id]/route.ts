
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
      return { tasks: [] };
    }
    throw error;
  }
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();
  const taskIndex = db.tasks.findIndex(task => task.id === params.id);
  if (taskIndex === -1) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
  db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...body };
  await writeDb(db);
  return NextResponse.json(db.tasks[taskIndex]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  const filteredTasks = db.tasks.filter(task => task.id !== params.id);
  if (filteredTasks.length === db.tasks.length) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
  db.tasks = filteredTasks;
  await writeDb(db);
  return NextResponse.json({ message: 'Task deleted successfully' });
}
