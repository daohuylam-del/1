import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'log'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, log: `Log ${i}` }));

export default function Logs() {
  return (
    <div>
      <h1>Logs</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
