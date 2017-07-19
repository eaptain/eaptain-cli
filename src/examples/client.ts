import {EaptainCli} from '../index'

const client = new EaptainCli({db: '0'});

client.start({
    serviceName: 'demo333',
    host: '192.168.0.8',
    port: 1313,
    ms: 1000 * 3 // 3秒
});

setInterval(async () => {
    const services = await client.services();
    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const clients = await client.clients(service);
        for (let j = 0; j < clients.length; j++) {
            console.log('service', clients[j], await client.client(service, clients[j]))
        }
    }
}, 1000);