import VirtualizedTable from '../components/VirtualizedTable';

const columns = ['id', 'account'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, account: `Account ${i}` }));

export default function BankAccounts() {
  return (
    <div>
      <h1>Bank Accounts</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
