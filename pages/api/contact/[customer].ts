
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { mailIt } from '@/services/mail';
import { midware } from '@/services/midware';
import connectMongo from '@/services/mongoose';
import Configuration from '@/models/config';
import { log } from '@/services/log';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

type ContactRes = {
  success: boolean,
  message: string
}

type ContactData = {
  section: string,
  category: string,
  email: string,
  name: string,  
  message: string,
  token: string
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ContactRes>
) {

  let resultStatus = 400;
  const result = {
    success: false,
    message: 'Could not send message'
  }

  await midware(req, res, cors);

  if (req.method !== 'POST') {
    res.status(405).send({ success: false, message: 'Only POST requests allowed' })
    return
  }

  try {
    const {
      section,
      category,
      email,
      name,
      message, 
      token
    }: ContactData = JSON.parse(req.body);
  
    log(`Contact body: ${req.body}`);
    
    // todo validate token
    
    if (section && email && name && message && token) {

      // get the config.
      await connectMongo();
      const { customer } = req.query;
      const configuration = await Configuration.findOne({ customerId: customer });
      log(`Configuration: ${JSON.stringify(configuration)}`);

      if (configuration) {
        const sectionRec = configuration.sections.get(section);
        log(`Section: ${sectionRec}`);

        if (sectionRec) {
          // if category was provided.. get contact info.
          if (category) {
            const categoryRec = sectionRec?.props.categories.find((val: IContactCategory) => val.title.toLowerCase() == category.toLowerCase());
            log(`Category: ${JSON.stringify(categoryRec)}`);

            if (categoryRec) {

              console.log('we made it! ' + JSON.stringify(categoryRec.email));

              mailIt({
                emailTo: categoryRec.email,
                name,
                subject: `Beacon contact from ${name}`,
                body: `A message from <b>${name} ${email}</b> <br/> <p>${message}</p>`
              });

              resultStatus = 200;
              result.success = true;
              result.message = 'Submitted';
            }

          } else {
            const emailRec = sectionRec?.props.email;
            log(`Email destination: ${JSON.stringify(sectionRec?.props)}`);

            if (emailRec && emailRec[0]) {
              console.log('we made it using email ' + JSON.stringify(emailRec[0]));

              mailIt({
                emailTo: emailRec[0],
                name,
                subject: `Beacon contact from ${name}`,
                body: `A message from <b>${name} ${email}</b> <br/> <p>${message}</p>`
              });

              resultStatus = 200;
              result.success = true;
              result.message = 'Submitted';

            } else {
              result.message = 'No email for selected section';
            }
          }
        } else {
          result.message = 'Invalid section for message destination';
        }
      } else {
        result.message = 'Invalid customer';
      }

    } else {
      result.message = 'Bad contact data';
    }
  } catch(err) {
    result.message = 'Invalid message body or missing fields';
  }

  res.status(resultStatus).json(result);

}
