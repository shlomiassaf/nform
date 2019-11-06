module.exports = {
  name: 'nform-material',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/nform-material',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
