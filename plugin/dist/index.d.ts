import { Plugin } from 'vite';

declare function buildSizeReport({ filename }: {
    filename?: string | undefined;
}): Plugin;

export { buildSizeReport as default };
