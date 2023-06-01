
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { mailIt } from '@/services/mail';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import Site from '@/models/site';
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
  category?: string,
  email: string,
  name: string,  
  message: string,
  phone?: string,
  moreInfo?: boolean,
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

  await apiMiddleware(req, res, cors);

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
      phone,
      moreInfo,
      message, 
      token
    }: ContactData = JSON.parse(req.body);
  
    log(`Contact body: ${req.body}`);
    
    // todo validate token
    
    if (section && email && name && message && token) {

      // get the config.
      await connectMongo();
      const { siteId } = req.query;
      const site = await Site.findById(siteId);
      log(`Site: ${JSON.stringify(site)}`);

      if (site) {
        const sectionRec = site.sections.get(section);
        log(`Section: ${sectionRec}`);

        if (sectionRec) {

          // setup email message
          let bodyText = `<p><b>The following content was entered by an InfoChat user on your website</b></p><b>Name: ${name}  |  Email: ${email}  |  Phone: ${phone || 'Not Provided'}</b> <br/> <hr/><br/>`
          bodyText += `<p>${message}</p>`;

          const mailBody = {
            emailTo: '',
            name,
            subject: `InfoChat App contact from ${name}`,
            body: bodyText
          }

          // if category was provided.. get contact info.
          if (category) {
            const categoryRec = sectionRec?.props.categories.find((val: IContactCategory) => val.title.toLowerCase() == category.toLowerCase());
            log(`Category: ${JSON.stringify(categoryRec)}`);

            if (categoryRec) {
              log('we made it! ' + JSON.stringify(categoryRec.email));
              
              mailBody.emailTo = categoryRec;

              mailIt(mailBody);

              resultStatus = 200;
              result.success = true;
              result.message = 'Submitted';
            }

          } else {
            const emailRec = sectionRec?.props.email;
            log(`Email destination: ${JSON.stringify(sectionRec?.props)}`);

            if (emailRec && emailRec[0]) {
              log('we made it using email ' + JSON.stringify(emailRec[0]));

              mailBody.emailTo = emailRec[0];

              mailIt(mailBody);

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
