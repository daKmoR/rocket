import { MdjsProcessPlugin } from '@mdjs/core';

export const setupUnifiedPluginsFn: (plugins: MdjsProcessPlugin[]) => MdjsProcessPlugin[];

export interface EleventPluginMdjsUnified {
  setupUnifiedPlugins?: setupUnifiedPluginsFn[];
}
