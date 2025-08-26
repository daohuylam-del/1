import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'statement'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, statement: `Statement ${i}` }));

export default function Statements() {
  return (
    <div>
      <h1>Statements</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
