const fs = require('fs');

class StatsLoader {
  constructor(statsFilePath) {
    const buffer = fs.readFileSync(statsFilePath);
    if (!buffer) {
      throw new Error('Stats file not found at the given location.');
    }
    this.stats = JSON.parse(buffer);
    ['publicPath', 'entrypoints', 'namedChunkGroups'].forEach(key => {
      if (!this.stats[key]) {
        throw new Error(`Key ${key} missing from stats file.`);
      }
    });
  }

  getElements(chunkName) {
    const assets = Object.values(this.stats.entrypoints).reduce(
      (accumulator, entrypoint) => {
        entrypoint.assets.forEach(asset => accumulator.push(asset));
        return accumulator;
      },
      []
    );

    if (chunkName && this.stats.namedChunkGroups[chunkName]) {
      this.stats.namedChunkGroups[chunkName].assets.forEach(asset => assets.push(asset));
    }

    return assets.map(asset => ({
      as: asset.endsWith('.js') ? 'script' : 'style',
      href: `${this.stats.publicPath}${asset}`,
    }));
  }
}

module.exports = StatsLoader;