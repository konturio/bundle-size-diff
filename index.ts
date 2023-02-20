import core from '@actions/core';
import fileSize from 'filesize';
import { checkPaths } from './checkPaths';
import { getErrorMessage } from './getErrorMessage';
import { getStatsDiff } from './getStatsDiff';
import { Assets } from './types';

function generateData(assets: Assets) {
  const stats = getStatsDiff(assets.base, assets.pr);

  if (!stats || !stats.total) {
    throw new Error(`Something went wrong with stats conversion, probably files are corrupted.`);
  }

  core.setOutput('base_file_size', stats.total.oldSize);
  core.setOutput('base_file_string', fileSize(stats.total.oldSize));
  core.setOutput('pr_file_size', stats.total.newSize);
  core.setOutput('pr_file_string', fileSize(stats.total.newSize));
  core.setOutput('diff_file_size', stats.total.diff);
  core.setOutput('diff_file_string', fileSize(stats.total.diff));
  core.setOutput('percent', stats.total.diffPercentage.toFixed(2));
  core.setOutput('success', 'true');
}

async function run() {
  try {
    const assets = await checkPaths();
    generateData(assets);
  } catch (error) {
    core.setOutput('success', 'false');
    const errorMessage = getErrorMessage(error);
    core.setFailed(errorMessage);
  }
}

run();
