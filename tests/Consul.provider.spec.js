const test = require('ava');

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

    await consulProvider.init();
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

    await consulProvider.init();
    const config = await consulProvider.load();

    t.deepEqual(config, {
       dir: {
           p3: 3
       },
       p1: 1,
       p2: 'dwa'
    });
});

test('should update configuration', async (t) => {
    const ConsulProvider = require('../lib/Consul.provider');
    let resolver;
    let wait = new Promise((resolve) => {
        resolver = resolve;
    });
    let config = {};

    const consulProvider = new ConsulProvider({
        key: 'updating',
        watchInterval: 200
    }, {
        castNumbers: true
    });

    await consulProvider.init();
    consulProvider.on('update', async () => {
        config = await consulProvider.load();
        resolver();
    });

    await consulProvider.load();
    await wait;

    t.deepEqual(config, {
        dir: {
            p3: 4
        },
        p1: 5,
        p2: 'dwa'
    });
});

test('should initialize provider with existing configuration', async (t) => {
    const ConsulProvider = require('../lib/Consul.provider');

    const consulProvider = new ConsulProvider({
        key: (config) => { 
            return config.consulKey; }
    });

    await consulProvider.init({
        consulKey: 'muchconf'
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