function isNgCliTestRun() {
  const idx = process.argv.findIndex( a => a === 'test');
  if (idx > 0) {
    return process.argv[idx-1].endsWith('bin/ng');
  }
  return false;
}

const jestOptions = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  preset: 'jest-preset-angular',
  rootDir: '.',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
};

if (!isNgCliTestRun()) {
  jestOptions.setupFilesAfterEnv = [
    'jest-preset-angular/setupJest.js',
  ];
}

module.exports = jestOptions;
