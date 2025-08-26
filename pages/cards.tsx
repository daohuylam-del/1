import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'card'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, card: `Card ${i}` }));

export default function Cards() {
  return (
    <div>
      <h1>Cards</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
