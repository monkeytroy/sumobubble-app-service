
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { mailIt } from '@/services/mail';
import { midware } from '@/services/midware';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

type ContactRes = {
  success: boolean,
  message: string
}

type ContactData = {
  emailTo: string,
  email: string,
  name: string,  
  message: string,
  token: string
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ContactRes>
) {

  await midware(req, res, cors);

  if (req.method !== 'POST') {
    res.status(405).send({ success: false, message: 'Only POST requests allowed' })
    return
  }

  try {
    const {
      emailTo,
      email,
      name,
      message, 
      token
    }: ContactData = JSON.parse(req.body);
  
    console.log(req.body);
    
    // todo validate token
    
    if (emailTo && email && name && message && token) {

      mailIt({
        emailTo,
        name,
        subject: `Beacon contact from ${name}`,
        body: `A message from <b>${name} ${email}</b> <br/> <p>${message}</p>`
      });

      res.status(200).json({ 
        success: true,
        message: 'Contact submitted'
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Bad contact data!'
      });
    }
  } catch(err) {
    res.status(405).send({ success: false, message: 'Invalid message.'});
    return;
  }
}
