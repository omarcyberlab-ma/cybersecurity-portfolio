import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function FileUpload({ bucket = 'profile', onUploaded, accept = 'image/*' }: {
  bucket?: 'profile' | 'projects' | 'certs';
  onUploaded?: (result: { url: string; path: string }) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', f);
      formData.append('bucket', bucket);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Upload failed');
        return;
      }

      onUploaded?.({ url: data.url, path: data.path });
      toast.success('Upload complete');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" hidden accept={accept} onChange={(e) => e.target.files && onFile(e.target.files[0])} />
      <button onClick={() => inputRef.current?.click()} disabled={busy}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 font-mono bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 h-8 px-3 py-1.5 text-xs"
      >
        {busy ? 'Uploading…' : 'Upload'}
      </button>
    </div>
  );
}
