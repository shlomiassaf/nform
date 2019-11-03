module.exports = {
  name: 'nform-demo-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/nform-demo-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
