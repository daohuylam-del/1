import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'reconcile'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, reconcile: `Reconcile ${i}` }));

export default function Reconcile() {
  return (
    <div>
      <h1>Reconcile</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
