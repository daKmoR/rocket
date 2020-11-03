export interface DevServerOptions {
  rootDir?: string;
}

export interface EleventyOptions {
  dir?: {
    includes?: string;
    data?: string;
    output?: string;
  };
  modifyConfig?: function;
}

export interface RocketTheme {
  path: string;
  setupUnifiedPlugins: function; // TODO: improve
  setupPlugins: function; // TODO: improve
}

export interface RocketCliOptions {
  command: string;
  pathPrefix: string;
  configDir: string;
  _configDirCwdRelative: string;
  inputDir: string;
  _inputDirConfigDirRelative: string;
  outputDir: string;
  watch: boolean;
  themes: Array<RocketTheme>;
  devServer: DevServerOptions;
  eleventy: EleventyOptions;
  setupUnifiedPlugins?: function; // TODO: improve
  setupPlugins?: function; // TODO: improve
  _themePathes?: Array<string>;
}
