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
    test: /\.js$/,
    include: [
      path.resolve(__dirname, 'node_modules/@react-native/debugger-frontend'),
      path.resolve(__dirname, 'node_modules/@react-native/community-cli-plugin'),
    ],
    use: [
      // Replace occurrences like `${import.meta.resolve("./file.css")}`
      {
        loader: require.resolve('string-replace-loader'),
        options: {
          // use a RegExp literal to avoid JS string escape complexity
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
    ],
  };

  // Prepend the rule so it runs before other loaders process these files
  config.module.rules.unshift(replaceRule);

  return config;
};
