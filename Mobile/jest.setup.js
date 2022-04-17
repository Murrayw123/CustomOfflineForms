const { globals } = require('./jest.config');

module.exports = async function () {
    globals.TEST = true;
};
