const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(pluginWebc);
    eleventyConfig.addPassthroughCopy("./docs-src/css/");
    eleventyConfig.addWatchTarget("./docs-src/css/");
    return {
        dir: {
            input: "docs-src",
            output: "docs"
        },
    };
};