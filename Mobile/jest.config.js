const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
    preset: 'react-native',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json'
        }
    },
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.jsx$': 'babel-jest',
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.tsx?$': 'ts-jest'
    },
    globalSetup: './jest.setup.js',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$'
};
