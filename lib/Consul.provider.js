const { Provider } = require('muchconf');
const consul = require('consul');

class ConsulProvider extends Provider {
    /**
     * Creates consul provider
     * @param {object} consulOptions options for consul provider
     * @param {string} consulOptions.key consul directory with service configuration
     * @param {number} [consulOptions.watchInterval] the time in milliseconds to wait in between checking of configuration update
     * @param {string} [consulOptions.host='127.0.0.1'] agent address
     * @param {number} [consulOptions.port=8500] agent http(s) port
     * @param {boolean} [consulOptions.secure=false] enable https
     * @param {string[]} [consulOptions.ca] array of strings or Buffers of trusted certificates in PEM format
     * @param {object} [consulOptions.defaults] common method call options that will be included with every call
     * @param {object} [commonProviderOptions] common provider options
     * @param {boolean} [commonProviderOptions.castNumber] convert strings to numbers
     * @param {boolean} [commonProviderOptions.converTrueFalseStrings] convert true/false strings to boolean
     * @param {boolean} [commonProviderOptions.cutQuotations] trim quotations form string
     * @param {object} [commonProviderOptions.not] conditions when provider should not be used
     * @param {object} [commonProviderOptions.is] conditions when provider should be used
     */
    constructor(consulOptions, commonProviderOptions) {
        super(commonProviderOptions);
        this.configuration = {};
        this.checkSum = 0;
        this.consulOptions = consulOptions;
    }

    init(currenConfig) {
        const serverOptions = {
            host: this.setOption(this.consulOptions.host, currenConfig) || '127.0.0.1',
            port: this.setOption(this.consulOptions.port, currenConfig) || 8500,
            secure: this.setOption(this.consulOptions.secure, currenConfig) || false,
            ca: this.setOption(this.consulOptions.ca, currenConfig),
            defaults: this.setOption(this.consulOptions.defaults, currenConfig),
            promisify: true
        };

        this.consulKey = this.setOption(this.consulOptions.key, currenConfig);
        this.consulServer = consul(serverOptions);

        let watchInterval = this.setOption(this.consulOptions.watchInterval, currenConfig);

        if(watchInterval) {
            this.enableWatching();
            this.watchInterval = watchInterval;
            this.watchConsul();
        }
    }

    /**
     * Enables watch mode
     * @fires ConsulProvider#update
     */
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

    /**
     * Gets configuration from consul kv store
     * @returns Promise which resolves to object with configuration and checksum
     */
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

    /**
     * Loads configuration
     * @returns Promise
     */
    async load() {
        this.configuration = await this.getConsulConfiguration();
        this.checkSum = this.configuration.checkSum;
        return this.configuration.consulConfig;
    }
}

module.exports = ConsulProvider;