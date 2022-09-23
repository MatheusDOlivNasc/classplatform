import * as express from 'express';
import {
  checkoutStripe,
  retriveStripe,
  paymentStripe,
  checkStripe
} from './payment.controller';

import {
  sendAlert,
  updateEmail,
  updatePassword
} from './user.controller';

import * as cors from 'cors';

import * as functions from "firebase-functions";

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: "*",
  preflightContinue: false,
}

const app = express()

app.use(cors(options));

app.get('/', (req, res) => res.status(200).send('Hello world!'))
app.post('/stripe-checkout', checkoutStripe)
app.post('/stripe-retrive', retriveStripe)
app.post('/stripe-payment', paymentStripe)
app.post('/stripe-check', checkStripe)
app.post('/send-alert', sendAlert)
app.post('/update-email', updateEmail)
app.post('/update-password', updatePassword)

app.options("*", cors(options));

exports.app = functions.https.onRequest(app)
