import { useRouter } from 'next/router';
import VirtualizedTable from '../../../components/VirtualizedTable';

const columns = ['id', 'mapping'];
const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, mapping: `Mapping ${i}` }));

export default function AdAccountMappings() {
  const { query } = useRouter();
  return (
    <div>
      <h1>Ad Account {query.id} Mappings</h1>
      <VirtualizedTable columns={columns} rows={rows} onSave={r => console.log('save', r.length)} />
    </div>
  );
}
