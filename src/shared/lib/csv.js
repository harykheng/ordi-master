function escapeCsvField(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// No library — this is a plain enough format that hand-rolling it avoids a
// dependency. Leading BOM (U+FEFF) is so Excel opens it as UTF-8 instead of
// guessing wrong and mangling "Rp"/accented characters.
export function downloadCsv(filename, headers, rows) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(','));
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
