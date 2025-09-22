import mqtt, { IClientOptions, MqttProtocol } from 'mqtt';
import { QoS } from "mqtt-packet"

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class MQTTLogger {

    constructor() {
    }

    public info(message: string): void {
        this.log('INFO', message);
    }

    public warn(message: string): void {
        this.log('WARN', message);
    }

    public error(message: string, error?: Error): void {
        this.log('ERROR', message, error);
    }

    public debug(message: string): void {
        this.log('DEBUG', message);
    }

    private log(level: LogLevel, message: string, error?: Error): void {
        const logObject: { [key: string]: any } = {
            level,
            timestamp: new Date().toISOString(),
            logger: "mqtt",
            message,
        };

        if (error && error.stack) {
            logObject.stack = error.stack;
        }

        const logJson: string = JSON.stringify(logObject);
        switch (level) {
            case 'INFO':
                console.info(logJson);
                break;
            case 'WARN':
                console.warn(logJson);
                break;
            case 'ERROR':
                console.error(logJson);
                break;
            case 'DEBUG':
                console.debug(logJson);
                break;
        }
    }
}

class MQTTClientOptions implements IClientOptions {
    protocol: MqttProtocol | undefined;
    host: string;
    port: number;
    clientId: string;
    username: string;
    password: string;

    constructor(protocol: MqttProtocol | undefined, host: string, port: number, clientId: string, username: string, password: string) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.clientId = clientId;
        this.username = username;
        this.password = password;
    }
}

export class MQTTClient {
    private readonly broker: string;
    private readonly client: mqtt.MqttClient | undefined;
    private readonly logger: MQTTLogger = new MQTTLogger();

    constructor(protocol: MqttProtocol | undefined, host: string, port: number, clientId: string, username: string, password: string) {
        const options: MQTTClientOptions = new MQTTClientOptions(protocol, host, port, clientId, username, password);
        this.broker = `${options.protocol}://${options.host}:${options.port}`;
        this.client = mqtt.connect(this.broker, options);
    }

    protected getClient(): mqtt.MqttClient {
        if (!this.client) {
            throw new Error('[MQTT] client is not initialized');
        }

        return this.client;
    }

    public getLogger(): MQTTLogger {
        return this.logger;
    }

    private onConnect(): void {
        this.getClient().on("connect", (): void => {
            if (this.client!.connected) {
                console.log(`[MQTT] connected with [${this.broker}]`);
            }
            else {
                console.error('[MQTT] connection disconnected');
            }
        });

        this.getClient().on("error", (err: Error | any): void => {
            console.error(`[MQTT] connection on ${err}`);
        });
    }

    public publish(topic: string, message: string | any, qos: QoS): void {
        try {
            this.getClient().publish(topic, message, {qos: qos, retain: false, dup: false}, (err) => {
                if (err) {
                    this.getLogger().error(`[MQTT] error publishing message to topic ${topic}: ${err}`);
                } else {
                    this.getLogger().info(`[MQTT] message published to topic ${topic}`);
                }
            });
        } catch (error) {
            this.getLogger().error(`[MQTT] error publishing message to topic ${topic}: ${error}`);
        }
    }

    public subscribe(topic: string, qos: QoS, callback: (message: any) => void): void {
        try {
            this.getClient().subscribe(topic, {qos: qos}, (err: Error | null): void => {
                if (err) {
                    this.getLogger().error(`[MQTT] error subscribing to topic ${topic}: ${err}`);
                } else {
                    this.getLogger().info(`[MQTT] subscribed to topic ${topic}`);
                }
            });

            this.getClient().on("message", (_topic: string, _message: Buffer): void => {
                if (_topic === topic) {
                    callback(_message.toString());
                } else return;
            });
        } catch (error) {
            this.getLogger().error(`[MQTT] error subscribing to topic ${topic}: ${error}`);
        }
    }
}