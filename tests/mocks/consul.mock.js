const db = require('./consulData');
const updating = require('./consulData2');

const kv = {
    muchconf: db,
    updating: updating
};

function consul() {
    return {
        kv: {
            get: (filter) => {
                return new Promise((resolve) => {
                    return resolve(kv[filter.key].data);
                });
            }
        }
    }
};

module.exports = consul;