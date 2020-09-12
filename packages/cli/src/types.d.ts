export interface DevServerOptions {
  rootDir?: string;
}

export interface EleventyOptions {
  pathPrefix: string;
  templatePathPrefix: string;
  dir: {
    includes: string;
    data: string;
  };
}

export interface RocketCliOptions extends EleventyOptions {
  command: string;
  configDir: string;
  inputDir: string;
  themePath: string;
  themePackage: string;
  devServer: DevServerOptions;
}
