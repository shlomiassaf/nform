module.exports = {
  name: 'nform',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/nform',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
