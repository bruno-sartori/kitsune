export function hello(): string;

export function merge_chunks(fileName: string, savedFileHash: string, totalChunks: number, userId: number, fileId: string): Promise<void>;

export function calculate_file_hash(chunk: Buffer): string;
