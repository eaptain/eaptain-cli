import * as redis from 'redis'
import {EventEmitter} from 'events';


export interface Service {
    host: string;
    port: number;
    serviceName: string;
    ms: number;
}

export class EaptainCli extends EventEmitter {

    private config: redis.ClientOpts;

    private center: redis.RedisClient;

    private service: Service;

    private interval: NodeJS.Timer;

    constructor(config: redis.ClientOpts) {
        super();
        this.config = config;
        this.connectCenter();
    }

    connectCenter() {
        this.center = redis.createClient(this.config);
    }

    async start(service: Service) {
        this.service = service;
        await this.regist();
        this.interval = setInterval(() => {
            this.ping().catch((err: Error) => {
                this.emit('error', err);
            });
        }, this.service.ms * .8);
    }

    async regist() {
        return new Promise((resolve, reject) => {
            this.center.set(
                `service@${this.service.serviceName}@${this.service.host}:${this.service.port}`,
                Date.now().toString(),
                'PX',
                this.service.ms,
                (err) => {
                    if (err) return reject(err);
                    return resolve();
                })
        });
    }

    async ping() {
        return new Promise((resolve, reject) => {
            this.center.expire(
                `service@${this.service.serviceName}@${this.service.host}:${this.service.port}`, this.service.ms / 1000, (err) => {
                    if (err) return reject(err);
                    return resolve();
                })
        })
    }

}