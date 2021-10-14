module.exports = {
  package: './package.json',
  require: 'ts-node/register',
  extension: ['js', 'ts'],
  recursive: true,
  spec: './test/**/*.ts',
};
