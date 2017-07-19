import {EaptainCli} from '../index'

const client = new EaptainCli({});

client.start({
    serviceName: 'demo333',
    host: '192.168.0.8',
    port: 1313,
    ms: 1000 * 3
});