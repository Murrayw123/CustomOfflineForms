module.exports = function (api) {
    api.cache(true);

    const plugins = [
        [
            'module-resolver',
            {
                extensions: ['.tsx', 'json', '.ts'],
                root: ['./src']
            }
        ]
    ];

    return {
        presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
        plugins: plugins
    };
};
