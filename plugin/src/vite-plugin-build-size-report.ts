import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { writeFile } from 'node:fs';
import type { Plugin, ResolvedConfig } from 'vite';
import { LogEntry } from './types';
import { groups } from './groups';

function isDefined<T>(value: T | undefined | null): value is T {
  return value != null;
}

export function buildSizeReport({ filename = './size-report.json' }): Plugin {
  const compress = promisify(gzip);
  const report = new Array<LogEntry>();
  let config: ResolvedConfig;

  async function getCompressedSize(code: string | Uint8Array): Promise<number | null> {
    if (config.build.ssr || !config.build.reportCompressedSize) {
      return null;
    }

    const compressed = await compress(
      typeof code === 'string' ? code : Buffer.from(code),
    );

    return compressed.length;
  }

  return {
    name: 'vite:build-size-report',

    configResolved(cfg: ResolvedConfig) {
      config = cfg;
    },

    closeBundle() {
      writeFile(filename, JSON.stringify(report, null, 2), (err) => {
        if (err) {
          console.error(`Failed to save report in ${filename}`, err);
        } else {
          console.log(`Report saved in ${filename}`);
        }
      });
    },

    async writeBundle(_, output) {
      const entries = (
        await Promise.all(
          Object.values(output).map(async (chunk): Promise<LogEntry | null> => {
            if (chunk.type === 'chunk') {
              return {
                name: chunk.fileName,
                group: 'JS',
                size: chunk.code.length,
                compressedSize: await getCompressedSize(chunk.code),
                mapSize: chunk.map ? chunk.map.toString().length : null,
              };
            } else {
              if (chunk.fileName.endsWith('.map')) return null;
              const isCSS = chunk.fileName.endsWith('.css');
              return {
                name: chunk.fileName,
                group: isCSS ? 'CSS' : 'Assets',
                size: chunk.source.length,
                mapSize: null, // Rollup doesn't support CSS maps?
                compressedSize: isCSS ? await getCompressedSize(chunk.source) : null,
              };
            }
          }),
        )
      ).filter(isDefined);

      for (const group of groups) {
        const filtered = entries.filter((e) => e.group === group.name);
        if (!filtered.length) continue;
        for (const entry of filtered.sort((a, z) => a.size - z.size)) {
          report.push(entry);
        }
      }
    },
  };
}
