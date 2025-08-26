import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'setting'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, setting: `Setting ${i}` }));

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
