import path from 'node:path';
import { getInputs } from './getInputs';
import { LogEntry } from './plugin/src/types';

const importJSON = async (path: string) => {
  const json = await import(path, {
    assert: { type: 'json' },
  });
  return json;
};

async function importReferenceReport(base: string): Promise<Array<LogEntry>> {
  const report: Array<LogEntry> = await importJSON(base);
  return report;
}

async function importPrReport(pr: string): Promise<Array<LogEntry>> {
  const report: Array<LogEntry> = await importJSON(pr);
  return report;
}

export async function checkPaths() {
  const { basePath, prPath, excludedAssets } = getInputs();
  const reference = path.resolve(process.cwd(), basePath);
  const pr = path.resolve(process.cwd(), prPath);

  let refReport = await importReferenceReport(reference);
  if (!refReport) {
    throw new Error(`Base path is not correct. Current input: ${reference}`);
  }

  let prReport = await importPrReport(pr);
  if (!prReport) {
    throw new Error(`Pr path is not correct. Current input: ${pr}`);
  }

  if (excludedAssets) {
    const regex = new RegExp(excludedAssets);
    refReport = refReport.filter((asset) => !asset.name.match(regex));
    prReport = prReport.filter((asset) => !asset.name.match(regex));
  }

  return {
    base: refReport,
    pr: prReport,
  };
}
