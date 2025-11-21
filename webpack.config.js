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
  // By default only transform a small set of packages known to ship
  // `import.meta` occurrences that break non-ESM dev bundles. This keeps
  // the transform surface small and avoids accidental modification of
  // unrelated node_modules code.
  // You can extend the list by setting the IMPORT_META_PATCH_PACKAGES
  // environment variable to a comma-separated list of package names.
  // Note: import.meta transforms were previously applied here via
  // string-replace-loader as a temporary workaround. That transform has
  // been removed in favor of applying durable `patch-package` fixes to
  // affected node_modules packages (see `patches/`). Keep this file
  // minimal to avoid accidental modifications of third-party code.

  return config;
};
