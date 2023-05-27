
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import { log } from '@/services/log';
import Site from '@/models/site';
import connectMongo from '@/services/mongoose';
import { stripHtml } from "string-strip-html";
import { checkChatbaseChatbotExists, createChatbaseChatbot } from '@/services/chatbase';

const cors = Cors({
  methods: ['GET', 'PUT', 'POST', 'HEAD'],
});

export default async function handler(req: NextApiRequest, 
    res: NextApiResponse<ConfigRes | any>) {

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

  const { siteId } = req.query;
  let failMsg = 'Unable to create chatbot';

  log(`/api/chatbot/${siteId} put`);

  await connectMongo();

  // get the site.
  const site = await Site.findById(siteId);
  if (site) {

    // determine if a chatbot already exists.
    let chatbotExists = false;
    const chatbaseId = site?.chatbot?.chatbaseId;
    if (chatbaseId) {
      chatbotExists = await checkChatbaseChatbotExists(chatbaseId);
    }

    if (chatbotExists) {
      failMsg = `Chatbot for ${site?.title || 'your site'} already exists.`;
    } else {

      const sourceText = stripHtml(site.summary?.content || 'A new chatbot from InfoChat App!').result;

      const chatbotId = await createChatbaseChatbot(site?._id, sourceText);
      if (chatbotId) {
        // save the chatbot id
        site.chatbot.chatbaseId = chatbotId;

        await site.save();

        res.status(200).json({ success: true, message: 'Created', data: site });  
        return;
      }      
    }
  }
  
  invalid(res, failMsg);
}