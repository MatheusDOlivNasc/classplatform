import { Response } from 'express'
import { db, admin } from './config/firebase'

type sendAlert = {
  user: string
}

type sendRequest = {
  body: sendAlert,
  params: { entryId: string }
}

export const sendAlert = async (req: sendRequest, res: Response) => {
  let { user } = req.body
  let doc = await db.collection('User').where('id', '==', user).get()

  if(doc.docs.length > 0) {
    let alert = doc.docs[0].data()
    alert.alert = true

    db.collection('User').doc(alert.id).set(alert, {merge: true})

    return res.status(200).send({
      status: "ok"
    })
  } else {

    return res.status(200).send({
      status: "error"
    })
  }
}

type updateEmail = {
  uid: string,
  email: string
}

type updateEmailRequest = {
  body: updateEmail,
  params: { entryId: string }
}

export const updateEmail = async (req: updateEmailRequest, res: Response) => {
  let { uid, email } = req.body

  try {
    admin.auth().updateUser(uid, {
      email: email,
    })

    let doc = await db.collection('User').where('uid', '==', uid).get();

    if(doc.docs.length > 0) {
      let user = doc.docs[0].data();
      user.email = email;
      
      db.collection('User').doc(user.id).set(user, {merge: true});
    }

    return res.status(200).send({
      status: "ok"
    })
  } catch (error: any) {
    return res.status(500).send({
      status: "error",
      value: error
    })
  }
}

type updatePassword = {
  uid: string,
  password: string
}

type updatePasswordRequest = {
  body: updatePassword,
  params: { entryId: string }
}

export const updatePassword = async (req: updatePasswordRequest, res: Response) => {
  let { uid, password } = req.body

  try {
    admin.auth().updateUser(uid, {
      password: password,
    })

    return res.status(200).send({
      status: "ok"
    })
  } catch (error: any) {
    return res.status(500).send({
      status: "error"
    })
  }
}


/* firebase functions:config:set stripe.key="" */
/* client.email="" project.id="" private.key="" */
