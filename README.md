# muchconf consul provider

[![npm](https://img.shields.io/npm/v/muchconf-consul-provider.svg)](https://www.npmjs.com/package/muchconf-consul-provider)
[![Build Status](https://travis-ci.org/kmoskwiak/muchconf-consul-provider.svg?branch=master)](https://travis-ci.org/kmoskwiak/muchconf-consul-provider)

[Muchconf](https://github.com/kmoskwiak/muchconf) configuration provider for [consul](https://www.consul.io/) KV store. It supports application reloading on configuration update.

>Consul is a distributed service mesh to connect, secure, and configure services across any runtime platform and public or private cloud _(see: consul.io)_

## Getting started
Install module using your favorite package manager.
```bash
npm install muchconf-consul-provider
```

Create muchconf configuration store with consul provider. `key` is name of directory in consul store where configuration is kept. See [muchconf](https://github.com/kmoskwiak/muchconf) repository for more information how to use store.

```js
const { muchconf } = require('muchconf');
const { muchConsul } = require('muchconf-conusl-provider');

const configStore = muchconf([
    muchConsul({
        key: 'myService'
    })
]);

configStore.on('ready', (config) => {
    console.log('Service running at ' + config.ip + ':' + confgi.port);
});

configStore.load();
```

## Class: ConsulProvider

__Syntax:__

```js
new ConsulProvider(options, commonProviderOptions);
```
or
```js
muchConsul(options, commonProviderOptions);
```

| name             | type     | required  | default   | description    |
|------------------|----------|-----------|-----------|----------------|
| `options`        | object   | yes       |           | options for consul provider |
| `options.host`   | string | no    | 127.0.0.1 | agent address (see: [silas/node-consul](https://github.com/silas/node-consul)) |
| `options.port`   | number | no | 8500 | agent HTTP(S) port (see: [silas/node-consul](https://github.com/silas/node-consul)) |
| `options.secure` | boolean | no | false | enable HTTPS (see: [silas/node-consul](https://github.com/silas/node-consul)) |
| `options.ca`     | String[] | no | | array of strings or Buffers of trusted certificates in PEM format (see: [silas/node-consul](https://github.com/silas/node-consul)) |
| `options.defaults` | object | no | | common method call options that will be included with every call (ex: set default token), these options can be override on a per call basis (see: [silas/node-consul](https://github.com/silas/node-consul)) |
| `options.key` | string | yes | | the consul directory where configuration is stored |
| `options.watchInterval` | number | no | | the time in milliseconds to wait in between checking of configuration update |
| `commonProviderOptions`      | object   | no        | see below        | common options for provider                              |
| `commonProviderOptions.castNumbers` | boolean | no | false | if possible, strings will be converted to number, e.g. '2' will be 2 |
| `commonProviderOptions.convertTrueFalseStrings` | boolean | no | false | strings like 'true' or 'false' will be converted to boolean |
| `commonProviderOptions.cutQuotations` | boolean | no | false | double quotation marks form beginning and ending of string will be cut off. E.g. '"some value"' will be 'some value' |
| `commonProviderOptions.not` | object | no | | conditions when provider should not be used |
| `commonProviderOptions.is` | object | no  | | conditions when provider should be used     |

__Events:__

`update` fired on configuration change if configuration watching is enabled.

## Tests

```js
npm run test
```