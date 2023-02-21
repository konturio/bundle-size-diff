import * as core from '@actions/core';

export const getInputs = () => {
  const inputs = {
    basePath: core.getInput('base_path'),
    prPath: core.getInput('pr_path'),
    excludedAssets: core.getInput('excluded_assets'),
  };

  if (inputs.basePath === '') throw new Error('`basePath` property is required');
  if (inputs.prPath === '') throw new Error('`prPath` property is required');

  return inputs;
};
