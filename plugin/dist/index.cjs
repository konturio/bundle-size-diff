"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/vite-plugin-build-size-report.ts
var import_node_zlib = require("zlib");
var import_node_util = require("util");
var import_node_fs = require("fs");

// src/groups.ts
var groups = [{ name: "Assets" }, { name: "CSS" }, { name: "JS" }];

// src/vite-plugin-build-size-report.ts
function isDefined(value) {
  return value != null;
}
function buildSizeReport({ filename = "./size-report.json" }) {
  const compress = (0, import_node_util.promisify)(import_node_zlib.gzip);
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
    closeBundle() {
      (0, import_node_fs.writeFile)(filename, JSON.stringify(report, null, 2), (err) => {
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
      console.log("");
    }
  };
}

// src/index.ts
var src_default = buildSizeReport;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
