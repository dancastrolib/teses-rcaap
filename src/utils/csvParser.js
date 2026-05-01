import Papa from 'papaparse';

export function parseCSV(text) {
  const result = Papa.parse(text, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    quoteChar: '"',
  });

  return result.data.map((row) => {
    const cleanRow = {};

    Object.entries(row).forEach(([key, value]) => {
      const cleanKey = typeof key === 'string' ? key.trim() : key;
      cleanRow[cleanKey] = typeof value === 'string' ? value.trim() : value;
    });

    return cleanRow;
  });
}