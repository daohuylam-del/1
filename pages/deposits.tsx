import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'deposit'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, deposit: `Deposit ${i}` }));

export default function Deposits() {
  return (
    <div>
      <h1>Deposits</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
