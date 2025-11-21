// Custom Expo webpack config: apply a small replacement loader to
// neutralize `import.meta.resolve(...)` occurrences shipped in some
// node_modules packages so they don't reach the browser as raw syntax.
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add a rule to run string-replace-loader over specific node_modules
  // that were found to include `import.meta.resolve(...)` in their
  // distributed JS. The replacement turns import.meta.resolve("./x")
  // into a plain string "./x" which is safe for dev bundles and only
  // affects sourceURL comments and similar helper usages.
  const replaceRule = {
    // Match both .js and .mjs files so ESM-distributed packages (e.g. .mjs)
    // are transformed as well. We previously only matched `.js` which
    // missed several node_modules files that ship `.mjs` with `import.meta`.
    test: /\\.m?js$/,
    // Apply to node_modules JS shipped to the browser. This is a dev-time
    // transform to neutralize a few import.meta patterns that cause runtime
    // SyntaxErrors in non-ESM bundles.
    include: [path.resolve(__dirname, 'node_modules')],
    use: [
      // Replace occurrences like `${import.meta.resolve("./file.css")}`
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          search: /\$\{\s*import\.meta\.resolve\((['"`])(.+?)\1\)\s*\}/g,
          replace: '"$2"',
        },
      },
      // Replace plain import.meta.resolve("...") occurrences
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          search: /import\.meta\.resolve\((['"`])(.+?)\1\)/g,
          replace: '"$2"',
        },
      },
      // Replace import.meta.url references with an empty string
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          search: /import\.meta\.url/g,
          replace: '""',
        },
      },
      // Replace import.meta.env.MODE with process.env.NODE_ENV (common usage)
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          search: /import\.meta\.env\.MODE/g,
          replace: 'process.env.NODE_ENV',
        },
      },
      // Replace import.meta.env with a small runtime shim reference. The
      // shim is provided below via DefinePlugin as `window.__import_meta_stub__`.
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          search: /import\.meta\.env/g,
          replace: 'window.__import_meta_stub__.env',
        },
      },
    ],
  };

  // Prepend the rule so it runs before other loaders process these files
  config.module.rules.unshift(replaceRule);

  // Provide a small runtime shim for `import.meta.env` references in the web
  // dev build. DefinePlugin will replace this identifier at compile time with
  // a JSON object containing an `env` shape. We reference it above as
  // `window.__import_meta_stub__` so it's available at runtime in the browser.
  const webpack = require('webpack');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.DefinePlugin({
    'window.__import_meta_stub__': JSON.stringify({ env: { MODE: process.env.NODE_ENV || 'development' } })
  }));

  return config;
};
