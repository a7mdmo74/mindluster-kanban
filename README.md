# Mindluster Kanban

Mindluster Kanban is a modern Kanban board application built with [Next.js](https://nextjs.org), [React](https://react.dev), [Material UI](https://mui.com/), [Zustand](https://zustand-demo.pmnd.rs/), and [React Query](https://tanstack.com/query/v5). It features drag-and-drop task management, real-time updates, and a beautiful, responsive UI.

## Features

- 📝 Create, edit, and delete tasks
- 📋 Organize tasks into columns: Backlog, In Progress, Review, Done
- 🔍 Search tasks by title or description
- 🟦 Drag and drop tasks between columns
- ⚡ Instant UI updates with React Query and Zustand
- 🎨 Built with Material UI for a modern look
- 🗃️ Mock API with JSON Server (no backend required)

## Getting Started

This project uses a mock API server. You need to run two processes in separate terminals: the Next.js development server and the JSON server.

### 1. Start the Mock API Server

This project uses [JSON Server](https://github.com/typicode/json-server) to mock a REST API for tasks. Start it with:

```bash
npm run server
```

The server will run at [http://localhost:4000](http://localhost:4000).

### 2. Start the Next.js Development Server

In a separate terminal, run:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Add a Task:** Click the "Add Task" button in any column.
- **Edit/Delete a Task:** Hover over a task card to reveal edit and delete icons.
- **Move Tasks:** Drag and drop tasks between columns.
- **Search:** Use the search bar at the top to filter tasks by title or description.

All data is stored in `db.json` and managed via the mock API.

---

## Tech Stack

- Next.js 15
- React 19
- Material UI 7
- Zustand (state management)
- React Query (data fetching/caching)
- JSON Server (mock API)

## Project Structure

- `src/components/` – UI components (Board, BoardColumn, TaskCard, TaskModal)
- `src/hooks/` – React Query hooks for tasks
- `src/lib/` – API functions and typings
- `src/store/` – Zustand store for UI state
- `db.json` – Mock database for tasks

## Customization

- You can edit `db.json` to pre-populate tasks or change the schema.
- UI and logic can be customized in the `src/` directory.

## License

This project is for educational/demo purposes. Feel free to use and modify it!
