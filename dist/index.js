"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_core2 = __toESM(require("@actions/core"));
var import_filesize = __toESM(require("filesize"));

// checkPaths.ts
var import_path = __toESM(require("path"));

// getInputs.ts
var import_core = __toESM(require("@actions/core"));
var getInputs = () => ({
  basePath: import_core.default.getInput("base_path"),
  prPath: import_core.default.getInput("pr_path"),
  excludedAssets: import_core.default.getInput("excluded_assets")
});

// checkPaths.ts
async function importReferenceReport(base) {
  const report = await import(base);
  return report;
}
async function importPrReport(pr) {
  const report = await import(pr);
  return report;
}
async function checkPaths() {
  const { basePath, prPath, excludedAssets } = getInputs();
  const reference = import_path.default.resolve(process.cwd(), basePath);
  const pr = import_path.default.resolve(process.cwd(), prPath);
  let baserReport = await importReferenceReport(reference);
  if (!baserReport) {
    throw new Error(`Base path is not correct. Current input: ${reference}`);
  }
  let prReport = await importPrReport(pr);
  if (!prReport) {
    throw new Error(`Pr path is not correct. Current input: ${pr}`);
  }
  if (excludedAssets) {
    const regex = new RegExp(excludedAssets);
    baserReport = baserReport.filter((asset) => !asset.name.match(regex));
    prReport = prReport.filter((asset) => !asset.name.match(regex));
  }
  return {
    base: baserReport,
    pr: prReport
  };
}

// getErrorMessage.ts
function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "Unknown error";
}

// getStatsDiff.ts
function getStatsDiff(base, pr) {
  const oldSize = base.reduce((acc, a) => acc + a.size, 0);
  const newSize = pr.reduce((acc, a) => acc + a.size, 0);
  const diff = newSize - oldSize;
  const diffPercentage = diff / (oldSize / 100);
  return {
    total: {
      oldSize,
      newSize,
      diff,
      diffPercentage
    }
  };
}

// index.ts
function generateData(assets) {
  const stats = getStatsDiff(assets.base, assets.pr);
  if (!stats || !stats.total) {
    throw new Error(`Something went wrong with stats conversion, probably files are corrupted.`);
  }
  import_core2.default.setOutput("base_file_size", stats.total.oldSize);
  import_core2.default.setOutput("base_file_string", (0, import_filesize.default)(stats.total.oldSize));
  import_core2.default.setOutput("pr_file_size", stats.total.newSize);
  import_core2.default.setOutput("pr_file_string", (0, import_filesize.default)(stats.total.newSize));
  import_core2.default.setOutput("diff_file_size", stats.total.diff);
  import_core2.default.setOutput("diff_file_string", (0, import_filesize.default)(stats.total.diff));
  import_core2.default.setOutput("percent", stats.total.diffPercentage.toFixed(2));
  import_core2.default.setOutput("success", "true");
}
async function run() {
  try {
    const assets = await checkPaths();
    generateData(assets);
  } catch (error) {
    import_core2.default.setOutput("success", "false");
    const errorMessage = getErrorMessage(error);
    import_core2.default.setFailed(errorMessage);
  }
}
run();
