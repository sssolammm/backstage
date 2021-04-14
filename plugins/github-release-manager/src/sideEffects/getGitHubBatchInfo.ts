/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PluginApiClient } from '../api/PluginApiClient';
import { getLatestRelease } from './getLatestRelease';

interface GetGitHubBatchInfo {
  pluginApiClient: PluginApiClient;
}

export const getGitHubBatchInfo = ({
  pluginApiClient,
}: GetGitHubBatchInfo) => async () => {
  const [{ repository }, latestRelease] = await Promise.all([
    pluginApiClient.getRepository(),
    getLatestRelease({ pluginApiClient }),
  ]);

  if (latestRelease === null) {
    return {
      latestRelease,
      releaseBranch: null,
      repository,
    };
  }

  const { branch } = await pluginApiClient.getBranch({
    branchName: latestRelease.target_commitish,
  });

  return {
    latestRelease,
    releaseBranch: branch,
    repository,
  };
};
