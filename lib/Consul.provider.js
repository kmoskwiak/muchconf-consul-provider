const { Provider } = require('../../muchconf');
const consul = require('consul');

class ConsulProvider extends Provider {
    constructor(consulOptions, options) {
        super(options);
        this.configuration = {};
        this.checkSum = 0;

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

        if(consulOptions.watchInterval) {
            this.enableWatching();
            this.watchInterval = consulOptions.watchInterval;
            this.watchConsul();
        }

    }

    watchConsul() {
        setTimeout(async () => {
            let config = await this.getConsulConfiguration();
            if(config.checkSum !== this.checkSum) {
                this.configuration = config.consulConfig;
                this.emit('update');
            }
            
            this.watchConsul();
        }, this.watchInterval);
    }

    getConsulConfiguration() {
        return this.consulServer.kv.get({
            key: this.consulKey,
            recurse: true
        })
        .then((data) => {
            let checkSum = 0;
            let consulConfig = {};
            data.forEach((element) => {
                let key = element.Key.slice(this.consulKey.length + 1);
                checkSum = checkSum + element.ModifyIndex;
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
            
            return { consulConfig, checkSum };
        });
    }

    async load() {
        this.configuration = await this.getConsulConfiguration();
        this.checkSum = this.configuration.checkSum;
        return this.configuration.consulConfig;
    }
}

module.exports = ConsulProvider;