import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onData: (rows: any[]) => void;
}

export default function BulkImportModal({ isOpen, onClose, onData }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: results => onData(results.data as any[]),
      error: err => setError(err.message)
    });
  };

  const handlePaste = () => {
    const text = textAreaRef.current?.value || '';
    const rows = text
      .trim()
      .split('\n')
      .map(line => line.split('\t'));
    onData(rows);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Bulk Paste / CSV Import</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <textarea ref={textAreaRef} placeholder="Paste tab-separated values here" rows={10} style={{ width: '100%' }} />
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={e => e.target.files && handleFile(e.target.files[0])}
          />
          <button onClick={handlePaste}>Import</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
