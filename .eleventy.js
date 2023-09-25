const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(pluginWebc, {
        components: "./docs-src/_includes/components/**/*.webc",
    });
    eleventyConfig.addPassthroughCopy("./docs-src/css/");
    eleventyConfig.addWatchTarget("./docs-src/css/");
    eleventyConfig.setTemplateFormats(["md", "njk"]);
    return {
        htmlTemplateEngine: "webc",
        dir: {
            input: "docs-src",
            output: "docs"
        },
    };
};