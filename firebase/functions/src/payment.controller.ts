import { Response } from 'express'
import { db, stripeKey } from './config/firebase';
import Stripe from 'stripe';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-08-01',
});
const domain = 'http://localhost:4200'

/* db
stripe
domain */

type checkoutStripe = {
  currency: string,
  uid: string
}

type checkoutRequest = {
  body: checkoutStripe,
  params: { entryId: string }
}

export const checkoutStripe = async (req: checkoutRequest, res: Response) => {
  let { currency, uid } = req.body
  let price

  try {
    var product = await db.collection('Payment').where('currency', '==', currency).get();

    if (product.docs.length > 0) {
      var prod = product.docs[0].data();
      if (prod.promotion == 0 || !prod.promotion) {
        price = prod.price;
      } else {
        price = prod.promotion;
      }

      currency = currency.toLowerCase()
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: 'Class'
          },
          unit_amount: price * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: domain + '/payment',
      cancel_url: domain + '/payment'
    })
    let pay: any = session
    pay.uid = uid
    db.collection('PayList').doc(pay.id).set(pay, {merge: true})

    return res.status(200).send({
      session: session
    })
  } catch (error: any) {
    return res.status(500).send({
      error: error
    })
  }
}

type retriveStripe = {
  uid: string
}

type retriveRequest = {
  body: retriveStripe,
  params: { entryId: string }
}

export const retriveStripe = async (req: retriveRequest, res: Response) => {
  let { uid } = req.body
  let session = []
  try {
    var sessions = await db.collection('PayList').where('uid', '==', uid).get();

    if (sessions.docs.length > 0) {
      for (let i = 0; i < sessions.docs.length; i++) {
        session[session.length] = sessions.docs[i].data()
      }
      for (let i = 0; i < sessions.docs.length; i++) {
        session[i] = await stripe.checkout.sessions.retrieve(session[i].id);
      }
    }

    return res.status(200).send({
      sessions: session
    })
  } catch (error: any) {
    return res.status(500).send({
      error: error
    })
  }
}

type paymentStripe = {
  uid: string,
  session: string
}

type paymentRequest = {
  body: paymentStripe,
  params: { entryId: string }
}

export const paymentStripe = async (req: paymentRequest, res: Response) => {
  let { uid, session } = req.body
  let user: any | {}
  try {
    var doc = await db.collection('User').where('uid', '==', uid).get();
    if (doc.docs.length > 0) {
      user = doc.docs[0].data()
    }

    user.pay = session

    db.collection('User').doc(user.id).set(user, {merge: true})

    return res.status(200).send({
      result: user
    })
  } catch (error: any) {
    return res.status(500).send({
      error: error
    })
  }
}


type checkStripe = {
  uid: string,
  session: string
}

type checkRequest = {
  body: checkStripe,
  params: { entryId: string }
}

export const checkStripe = async (req: checkRequest, res: Response) => {
  let { uid, session } = req.body
  
  try {
    await stripe.checkout.sessions.retrieve(session);

    return res.status(200).send({
      status: "ok"
    })
  } catch (error: any) {
    let user: any | {}
    var doc = await db.collection('User').where('uid', '==', uid).get()
    if (doc.docs.length > 0) {
      user = doc.docs[0].data()
    }
    user.pay = ""
    db.collection('User').doc(user.id).set(user, {merge: true})

    return res.status(200).send({
      status: "error"
    })
  }
}

/* firebase functions:config:set stripe.key="" */
/* client.email="" project.id="" private.key="" */
