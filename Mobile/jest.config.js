module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)'
    ],
    moduleDirectories: ['node_modules', './src']
};
