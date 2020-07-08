const path = require('path');

function resolvedNodePackagePath(resolvePath) {
  const hasNamespace = resolvePath.includes('@');
  const parts = resolvePath.split(path.sep);
  const pkgName = hasNamespace ? path.join(parts[0], parts[1]) : parts[0];
  parts.shift();
  if (hasNamespace) {
    parts.shift();
  }
  const purePath = path.join(...parts);
  const pkgJson = require.resolve(path.join(pkgName, 'package.json'));
  const pkgRoot = path.dirname(pkgJson);
  return path.join(pkgRoot, purePath);
}

module.exports = { resolvedNodePackagePath };
