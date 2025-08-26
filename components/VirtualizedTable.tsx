import { FixedSizeList as List } from 'react-window';
import { useEffect, useState } from 'react';
import BulkImportModal from './BulkImportModal';

interface Row {
  id: number | string;
  [key: string]: any;
}

interface Props {
  columns: string[];
  rows: Row[];
  onSave: (rows: Row[]) => void;
}

export default function VirtualizedTable({ columns, rows, onSave }: Props) {
  const [data, setData] = useState<Row[]>(rows);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') onSave(data);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave(data);
      }
      if (e.key === 'Escape') setShowImport(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [data, onSave]);

  const RowRenderer = ({ index, style }: { index: number; style: any }) => (
    <div
      style={{
        ...style,
        display: 'flex',
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
        padding: '0 8px'
      }}
    >
      {columns.map(col => (
        <div key={col} style={{ flex: 1 }}>
          {data[index][col] ?? ''}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, background: '#ddd', display: 'flex', padding: '0 8px' }}>
        {columns.map(col => (
          <div key={col} style={{ flex: 1 }}>
            {col}
          </div>
        ))}
        <button onClick={() => setShowImport(true)} style={{ marginLeft: 'auto' }}>
          Import
        </button>
      </div>
      <List height={300} itemCount={data.length} itemSize={35} width={'100%'}>
        {RowRenderer}
      </List>
      <BulkImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onData={rows => {
          setData(rows.map((r, i) => ({ id: i, ...r } as Row)));
          setShowImport(false);
        }}
      />
    </div>
  );
}
