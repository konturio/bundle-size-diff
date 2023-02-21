import * as core from '@actions/core';

export const getInputs = () => ({
  basePath: core.getInput('base_path'),
  prPath: core.getInput('pr_path'),
  excludedAssets: core.getInput('excluded_assets'),
});
