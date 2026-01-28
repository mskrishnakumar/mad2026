import { promises as fs } from 'fs';
import path from 'path';
import { fetchCSVData, parseCSV } from './azure-storage';

// Toggle between 'local' and 'azure' data sources
const DATA_SOURCE = process.env.DATA_SOURCE || 'local';

export async function fetchData<T>(fileName: string): Promise<T[]> {
  if (DATA_SOURCE === 'azure') {
    return fetchCSVData<T>(fileName);
  }

  // Local file system
  const filePath = path.join(process.cwd(), 'data', fileName);
  const csvText = await fs.readFile(filePath, 'utf-8');
  return parseCSV<T>(csvText);
}

export function getDataSource(): string {
  return DATA_SOURCE;
}
