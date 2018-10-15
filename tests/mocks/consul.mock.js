const db = require('./consulData');

function consul() {
    return {
        kv: {
            get: () => {
                return new Promise((resolve) => {
                    return resolve(db);
                })
            }
        }
    }
};

module.exports = consul;