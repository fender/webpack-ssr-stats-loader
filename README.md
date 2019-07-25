# webpack-ssr-stats-loader

Extract chunk data from a Webpack stats JSON file and converting into HTML tags for injection in server-side rendered markup.

## Why?

The motivation for creating this package was to assist in injecting `<link rel="preload" />` HTML elements on SSR. This allows maximum performance when code-splitting at a route level.

## Requirements

You'll need access to your [Webpack stats](https://webpack.js.org/api/stats/) as a JSON file. There is several ways to do this:
1. Use [webpack-stats-disk-plugin](https://github.com/fender/webpack-stats-disk-plugin)
1. Use [webpack-stats-disk-plugin](https://github.com/FormidableLabs/webpack-stats-plugin) if you don't SSR in your development environment
1. Pass `--json > <filename>.json` via webpack CLI commands, [see official docs](https://webpack.js.org/api/stats/).

## Usage

```es6
// Pass a relative path to where your stats file will be output.
// By default, this is in the output.path folder set in your webpack config.
const Loader = new StatsLoader('./static/stats.json');

// Grabs an array of all assets required to SSR the page.
// All entry points assets will be added.
// Optionally, pass in a chunkName and those assets will be added to.
const assets = Loader.getElements(chunkName);

// Use the assets array to build HTML strings for rendering, e.g:
const headHtml = `
  <head>
    ${assets.map(asset =>
      `<link rel="preload" as="${asset.as}" href="${asset.href}" />`
    ).join('\n')}
    ${assets.filter(asset => asset.as === 'style').map(asset =>
      `<link rel="stylesheet" href=${asset.href} />`
    ).join('\n')}
  </head>
`
const bodyFooterHtml = `
  ${assets.filter(asset => asset.as === 'script').map(asset =>
    `<script async src=${asset.href}></script>`
  ).join('\n')}
`;

```

