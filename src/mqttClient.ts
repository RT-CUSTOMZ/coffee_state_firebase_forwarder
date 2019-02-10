import {IClientOptions, Client, connect, IConnackPacket}  from 'mqtt'
import * as events from 'events'
import { TypedEventEmitter } from 'eventemitter-ts';

const typeDictionary = {
    "WorkingState" : "coffee_brewing",
    "ReadyState" : "coffee_ready"
}

import { FirebaseMessaging } from './schema/firebaseMessagingSchema';


export interface Events {
    message: FirebaseMessaging;
  }

// Setup Json validation
//////////////////////////////////////////////////////////////////////////////////////////
import * as Ajv from 'ajv'
const ajv = new Ajv();

// load generated typescript type information from json schema
import { CoffeeStateMqttTopic } from './schema/coffeeStateSchema'

const coffeeStateSchemaValidator = ajv.compile(
        require('../json_schema/coffeeStateSchema.json')
    );
const firebaseMessagingSchemaValidator = ajv.compile(
        require('../json_schema/firebaseMessagingSchema.json')
    );
//////////////////////////////////////////////////////////////////////////////////////////

export class MqttClient  extends TypedEventEmitter<Events> {

    mqttClient: Client;
    //notifications : Notifications;

    constructor(host: string) {
        super();
        //this.notifications = new Notifications();

        const opts: IClientOptions = {}

        this.mqttClient = connect(host, opts);
        this.mqttClient.on('connect', this.onConnect.bind(this));
        this.mqttClient.on('message', this.onMessage.bind(this));
    }

    onConnect() {
        this.mqttClient.subscribe('coffee/0/state');
        console.log("Connected to Mqtt Server.")
    }

    // private functions

    onMessage(topic: any, message: any): any {
        try { //JSON.parse may throw an SyntaxError exception
            const messageObj = JSON.parse(message) as CoffeeStateMqttTopic;
            const valid = coffeeStateSchemaValidator(messageObj);

            if (true === valid) {
                const messageToSend = {
                        type: typeDictionary[messageObj['state']],
                        timestamp: messageObj['timestamp']
                }
                console.log("Sending Notification: " + messageToSend); 

            this.emit("message", messageToSend);
            } else {
                console.log(ajv.errorsText(coffeeStateSchemaValidator.errors));
            }
        } catch(e) {
            console.error(e);
        }
    }

    end() {
        this.mqttClient.end();
    }
}

export default MqttClient;