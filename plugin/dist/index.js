// src/vite-plugin-build-size-report.ts
import { gzip } from "zlib";
import { promisify } from "util";
import { writeFile } from "fs";

// src/groups.ts
var groups = [{ name: "Assets" }, { name: "CSS" }, { name: "JS" }];

// src/vite-plugin-build-size-report.ts
function isDefined(value) {
  return value != null;
}
function buildSizeReport({ filename = "./size-report.json" }) {
  const compress = promisify(gzip);
  const report = new Array();
  let config;
  async function getCompressedSize(code) {
    if (config.build.ssr || !config.build.reportCompressedSize) {
      return null;
    }
    const compressed = await compress(
      typeof code === "string" ? code : Buffer.from(code)
    );
    return compressed.length;
  }
  return {
    name: "vite:build-size-report",
    configResolved(cfg) {
      config = cfg;
    },
    buildEnd() {
      writeFile(filename, JSON.stringify(report, null, 2), (err) => {
        if (err) {
          console.error(`Failed to save report in ${filename}`, err);
        } else {
          console.log(`Report saved in ${filename}`);
        }
      });
    },
    async writeBundle(_, output) {
      const entries = (await Promise.all(
        Object.values(output).map(async (chunk) => {
          if (chunk.type === "chunk") {
            return {
              name: chunk.fileName,
              group: "JS",
              size: chunk.code.length,
              compressedSize: await getCompressedSize(chunk.code),
              mapSize: chunk.map ? chunk.map.toString().length : null
            };
          } else {
            if (chunk.fileName.endsWith(".map"))
              return null;
            const isCSS = chunk.fileName.endsWith(".css");
            return {
              name: chunk.fileName,
              group: isCSS ? "CSS" : "Assets",
              size: chunk.source.length,
              mapSize: null,
              // Rollup doesn't support CSS maps?
              compressedSize: isCSS ? await getCompressedSize(chunk.source) : null
            };
          }
        })
      )).filter(isDefined);
      for (const group of groups) {
        const filtered = entries.filter((e) => e.group === group.name);
        if (!filtered.length)
          continue;
        for (const entry of filtered.sort((a, z) => a.size - z.size)) {
          report.push(entry);
        }
      }
    }
  };
}

// src/index.ts
var src_default = buildSizeReport;
export {
  src_default as default
};
