const { getDefaultConfig } = require('expo/metro-config');

/** @type {import ('expo/metro-config') .MetroConfig} */
module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Adds support for `.db` files for SQLite databases
  config.resolver.assetExts.push('db');
  config.resolver.assetExts.push('mp3');
  config.resolver.assetExts.push('obj');
  config.resolver.assetExts.push('glb');

  // React SVG transformer
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
