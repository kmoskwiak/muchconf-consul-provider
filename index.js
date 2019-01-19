const ConsulProvider = require('./lib/Consul.provider');
const { wrap } = require('muchconf');
module.exports = {
    ConsulProvider,
    muchConsul: wrap(ConsulProvider)
}