const test = require('ava');

const sinon = require('sinon');
const mockRequire = require('mock-require');
const consulMock = require('./mocks/consul.mock');

test.beforeEach(() => {
    mockRequire('consul', consulMock);
});

test('should connect to consul and get configuration', async (t) => {
    const ConsulProvider = require('../lib/Consul.provider');

    const consulProvider = new ConsulProvider({
        key: 'muchconf'
    });

    const config = await consulProvider.load();

    t.deepEqual(config, {
       dir: {
           p3: '3'
       },
       p1: '1',
       p2: 'dwa'
    });
});

test('should get configuration and convert strings to numbers', async (t) => {
    const ConsulProvider = require('../lib/Consul.provider');
    const consulProvider = new ConsulProvider({
        key: 'muchconf'
    }, {
        castNumbers: true
    });

    const config = await consulProvider.load();

    t.deepEqual(config, {
       dir: {
           p3: 3
       },
       p1: 1,
       p2: 'dwa'
    });
});