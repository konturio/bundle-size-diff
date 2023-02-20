import { groups } from './groups';

export type LogEntry = {
  name: string;
  group: typeof groups[number]['name'];
  size: number;
  compressedSize: number | null;
  mapSize: number | null;
};
