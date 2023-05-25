
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import { log } from '@/services/log';
import Site from '@/models/site';
import connectMongo from '@/services/mongoose';
import { stripHtml } from "string-strip-html";

const cors = Cors({
  methods: ['GET', 'PUT', 'POST', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      //await get(req, res);
      break;
    case 'PUT':
      await put(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason});
}

const put = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  const chatbaseUrl = 'https://www.chatbase.co/api/v1/create-chatbot';

  const { siteId } = req.query;

  await connectMongo();

  // get the site.
  const site = await Site.findById(siteId);

  log(`chatbot put for site ${siteId}`);

  if (site) {

    const sourceText = stripHtml(site.summary?.content || 'A new chatbot from InfoChat App!').result;

    const payload = {
      chatbotName: site.title,
      sourceText
    };

    log(`Building payload for ${JSON.stringify(payload)}`);

    const chatbaseRes = await fetch(chatbaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (chatbaseRes) {
      const chatbaseResJson = await chatbaseRes.json();

      if (chatbaseResJson.chatbotId) {

        // save the chatbot id, creating section if it does not exist. 
        // order here matters.  set def values.  spread the existing overtop.  spread props over that
        // like a cake!  (or onion)

        // sections is a map. get a js copy, update and set back.
        let chatbot = JSON.parse(JSON.stringify(site.sections.get('chatbot') || {}));

        chatbot = {
          enabled: true,
          content: '',
          ...chatbot,
          props: { 
            ...chatbot?.props,
            chatbaseId: chatbaseResJson.chatbotId
          }
        }

        site.sections.set('chatbot', chatbot);

        await site.save();

        res.status(200).json({ success: true, message: 'Created', data: site });  
        return;
      } else {
        log(`No json from chatbase ${JSON.stringify(chatbaseResJson)}`);  
      }
    } else {
      log(`No response from chatbase ${chatbaseRes}`);
    }
  }
  
  invalid(res, 'Unable to create chatbot.');
}
