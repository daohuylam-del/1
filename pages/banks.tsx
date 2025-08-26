import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'bank'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, bank: `Bank ${i}` }));

export default function Banks() {
  return (
    <div>
      <h1>Banks</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
