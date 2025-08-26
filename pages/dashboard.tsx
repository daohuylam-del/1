import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'name'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, name: `Item ${i}` }));

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
