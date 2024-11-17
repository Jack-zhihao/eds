import mqtt from 'mqtt';
const global = import.meta.env

export default class Mqtt {
    constructor () {
    }
    connect() {
        const client =  mqtt.connect(`ws://${global.VITE_MQTT_HOSTNAME}:8083/mqtt`, {
            clientId: 'mqttjs_' + new Date().getTime(),
            username: global.VITE_MQTT_USERNAME,
            password: global.VITE_MQTT_PASSWORD,
            keepalive: 60,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            encoding: 'utf8',
        })
        client.formatMsg = this.formatMsg
        return client
    }
    formatMsg(message){
        let resp = ''
        if (message instanceof ArrayBuffer) {
            const decoder = new TextDecoder('utf-8');
            resp = decoder.decode(message);
        } else {
            resp = message
        } 
        try {
            return JSON.parse(resp)
        } catch(error) {
            return resp
        }
    }
}
