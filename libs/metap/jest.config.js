module.exports = {
  name: 'metap',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/metap',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
