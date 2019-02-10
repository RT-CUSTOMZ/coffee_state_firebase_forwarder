import * as admin from 'firebase-admin';

// Setup Json validation
//////////////////////////////////////////////////////////////////////////////////////////
import * as Ajv from 'ajv'
const ajv = new Ajv();

// load generated typescript type information from json schema
import { FirebaseMessaging } from './schema/firebaseMessagingSchema';

const firebaseMessagingSchemaValidator = ajv.compile(
        require('../json_schema/firebaseMessagingSchema.json')
    );
//////////////////////////////////////////////////////////////////////////////////////////

var serviceAccount = require("../serviceAccountKey.json");

// see https://firebase.google.com/docs/reference/admin/node/admin.messaging.MessagingOptions
const options = {
    collapseKey: "coffee",
    timeToLive: 60*60*1 // in secounds -> 1 Hour
}

export class Notifications {
    app : any;
    constructor() {
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://coffee-page-moc.firebaseio.com"
        });
    }

    sendToAll(message : FirebaseMessaging) : void {
        const valid = firebaseMessagingSchemaValidator(message);
        
        if (true === valid) {
            const messaging  = admin.messaging(this.app);
            const messageToSend = {
                data: message
            }
            messaging.sendToTopic("coffee", messageToSend, options)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
        } else {
            console.log(ajv.errorsText(firebaseMessagingSchemaValidator.errors));
        }

    }
}


export default Notifications;