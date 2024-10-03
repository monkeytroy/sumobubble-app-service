
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import { log } from '@/services/log';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from "langchain/memory";

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      await get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

/**
 * Not sure.  Maybe get chat history?
 */
const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  try {
    res.status(200).send({ success: false, message: 'No chat history yet.'});
  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }
}

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason});
}

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  const { chatId, siteId } = req.query;
  
  const siteIdVal = Array.isArray(siteId) ? siteId[0] : siteId;
  const chatIdVal = Array.isArray(chatId) ? chatId[0] : chatId;

  log(`api/chat/${siteId}/${chatId}`);

  if (!siteIdVal) {
    return invalid(res, 'Missing site id');
  }

  try {
    
    // const session = await getToken({ req, secret: process.env.JWT_SECRET });
    // const customerId = session?.sub;
    // if (!customerId) {
    //   invalid(res, 'Could not get the customer ID');
    // }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const query = body?.query;
    
    // get the chat
    const chain = await createChain(siteIdVal, true);

    //console.log('Chain', chain);

    const text = await doTheAiChatThing(chain, query);

    // return it
    if (text) {
      res.status(200).json({ success: true, message: text });  
    } else {
      log(`Chat failed siteId: ${siteId} and chatId: ${chatId}`);
      invalid(res, 'Failed to chat');
      return;
    }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }
}


// move to a service

export const createChain = async(siteId: string, incSource?: boolean) => { 

  const vectorStore = await HNSWLib.load(`db/${siteId}`, new OpenAIEmbeddings());
    
  const chat = new ChatOpenAI({ temperature: 0 });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    chat,
    vectorStore.asRetriever(),
    {
      memory: new BufferMemory({
        memoryKey: "chat_history", // Must be set to "chat_history"
      }),
    }
  );

  return chain;

}

export const doTheAiChatThing = async (chain: ConversationalRetrievalQAChain, query: string) => {

  try {
    const chainRes = await chain.call({ question: query });
    // console.log('Chain res: ', chainRes);
    return chainRes?.text;
  } finally {
  }

  return 'Sorry, there is no information for that!';
}