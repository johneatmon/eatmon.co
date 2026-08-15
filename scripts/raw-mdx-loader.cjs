/** @type {import('webpack').LoaderDefinitionFunction} */
module.exports = function rawMdxLoader(source) {
  return `export default ${JSON.stringify(source)}`;
};
