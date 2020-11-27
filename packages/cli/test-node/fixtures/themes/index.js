export const eleventyObjectTheme = () => {
  return {
    eleventy: {
      dir: {
        data: '--theme-config-override--',
      },
    },
  };
};

export const eleventyFunctionTheme = () => {
  return {
    eleventy: eleventyConfig => {
      eleventyConfig.setQuietMode(true);

      return {
        dir: {
          data: '--theme-config-function-override--',
        },
      };
    },
  };
};
