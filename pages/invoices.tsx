import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'invoice'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, invoice: `Invoice ${i}` }));

export default function Invoices() {
  return (
    <div>
      <h1>Invoices</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
