import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ContainerClient | null = null;

function getConnectionString(): string {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
  }
  return connectionString;
}

function getContainerName(): string {
  return process.env.AZURE_STORAGE_CONTAINER_NAME || 'usethisone';
}

export function getBlobServiceClient(): BlobServiceClient {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(getConnectionString());
  }
  return blobServiceClient;
}

export function getContainerClient(): ContainerClient {
  if (!containerClient) {
    containerClient = getBlobServiceClient().getContainerClient(getContainerName());
  }
  return containerClient;
}

export async function listBlobs(): Promise<string[]> {
  const container = getContainerClient();
  const blobs: string[] = [];

  for await (const blob of container.listBlobsFlat()) {
    blobs.push(blob.name);
  }

  return blobs;
}

export async function downloadBlobAsText(blobName: string): Promise<string> {
  const container = getContainerClient();
  const blobClient = container.getBlobClient(blobName);
  const downloadResponse = await blobClient.download();

  if (!downloadResponse.readableStreamBody) {
    throw new Error(`Failed to download blob: ${blobName}`);
  }

  return streamToText(downloadResponse.readableStreamBody);
}

async function streamToText(readableStream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data) => {
      chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'));
    });
    readableStream.on('error', reject);
  });
}

export function parseCSV<T>(csvText: string): T[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const results: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });

    results.push(obj as T);
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export async function fetchCSVData<T>(blobName: string): Promise<T[]> {
  const csvText = await downloadBlobAsText(blobName);
  return parseCSV<T>(csvText);
}
