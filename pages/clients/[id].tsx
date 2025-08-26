import { useRouter } from 'next/router';
import VirtualizedTable from '../../components/VirtualizedTable';

const columns = ['id', 'detail'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, detail: `Detail ${i}` }));

export default function ClientDetail() {
  const { query } = useRouter();
  return (
    <div>
      <h1>Client {query.id}</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
