import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import { log } from '@/services/log';
import { ConfigRes } from '../../site/types';

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD']
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfigRes>) {
  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}

/**
 * Not sure.  Maybe get chat history?
 */
const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  try {
    res.status(200).send({ success: false, message: 'No chat history yet.' });
  } catch (err) {
    res.status(500).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};

/**
 * User posted chat message - todo figure out
 *
 * @param req
 * @param res
 * @returns
 */
const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  const { siteId } = req.query;

  const siteIdVal = Array.isArray(siteId) ? siteId[0] : siteId;

  log(`api/chat/${siteId}`);

  if (!siteIdVal) {
    res.status(500).send({ success: false, message: 'Missing site id' });
    return;
  }

  try {
    // const session = await getToken({ req, secret: process.env.JWT_SECRET });
    // const customerId = session?.sub;
    // if (!customerId) {
    //   invalid(res, 'Could not get the customer ID');
    // }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const query = body?.query;

    // do AI req
    const text = '';

    // return it
    if (text) {
      res.status(200).json({ success: true, message: text });
    } else {
      const msg = `Chat failed siteId: ${siteId}`;
      log(msg);
      res.status(500).send({ success: false, message: msg });
    }
  } catch (err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}` });
  }
};
