import path from 'path';
import { getInputs } from './getInputs';
import { LogEntry } from './plugin/types';

async function importReferenceReport(base: string): Promise<Array<LogEntry>> {
  const report: Array<LogEntry> = await import(base);
  return report;
}

async function importPrReport(pr: string): Promise<Array<LogEntry>> {
  const report: Array<LogEntry> = await import(pr);
  return report;
}

export async function checkPaths() {
  const { basePath, prPath, excludedAssets } = getInputs();
  const reference = path.resolve(process.cwd(), basePath);
  const pr = path.resolve(process.cwd(), prPath);

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
    pr: prReport,
  };
}
