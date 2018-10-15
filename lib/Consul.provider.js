const { Provider } = require('muchconf');
const consul = require('consul');

class ConsulProvider extends Provider {
    constructor(consulOptions, options) {
        super(options);

        const serverOptions = {
            host: consulOptions.host || '127.0.0.1',
            port: consulOptions.port || 8500,
            secure: consulOptions.secure || false,
            ca: consulOptions.ca,
            defaults: consulOptions.defaults,
            promisify: true
        };

        this.consulKey = consulOptions.key;
        this.consulServer = consul(serverOptions);

        this.getConsulConfiguration();
    }

    getConsulConfiguration() {
        return this.consulServer.kv.get({
            key: this.consulKey,
            recurse: true
        })
        .then((data) => {
            let consulConfig = {};
            data.forEach((element) => {
                let key = element.Key.slice(this.consulKey.length + 1);
                let keys = key.split('/');
                
                if(element.Value) {
                    let root = consulConfig;
                    keys.forEach((item, index) => {
                        
                        if(index === keys.length -1) {
                           return root[item] = this.parse(element.Value);
                        }
    
                        root[item] = root[item] || {};
                        root = root[item];
                    });
                }
            });
    
            return consulConfig;
        });
    }

    load() {
        return this.getConsulConfiguration();
    }
}

module.exports = ConsulProvider;