import VirtualizedTable from '../../components/VirtualizedTable';

const columns = ['id', 'client'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, client: `Client ${i}` }));

export default function Clients() {
  return (
    <div>
      <h1>Clients</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
