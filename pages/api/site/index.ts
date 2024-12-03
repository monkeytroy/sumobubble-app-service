import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import { getToken } from 'next-auth/jwt';
import Site from '@/models/site';
import { log } from '@/services/log';
import { ConfigRes, ISite } from './types';

const cors = Cors({
  methods: ['POST']
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfigRes>) {
  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'POST':
      await createSite(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}

/**
 * Create a new record.
 * @param req
 * @param res
 * @returns
 */
const createSite = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  try {
    await connectMongo();

    const session = await getToken({ req, secret: process.env.JWT_SECRET });

    // todo test if this can change... cust id
    const customerId = session?.sub;
    const customerEmail = session?.email;
    if (!customerId || !customerEmail) {
      log(`/api/site put missing customer info from session ${JSON.stringify(session)}`);
      invalid(res, 'Missiong customer information id or email.');
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const siteTitle = body?.title;
    if (!siteTitle) {
      invalid(res, 'Site name was not provided');
      return;
    }

    // TODO check subscription limits
    const total = await (await Site.find({ customerId: customerId })).length;
    if (total >= 2) {
      invalid(res, 'Already at the max number of sites allowed.');
      return;
    }

    // create new empty site.
    const newSite: ISite = {
      customerId,
      customerEmail,
      title: siteTitle,
      summary: {
        enabled: false,
        content: ''
      },
      chatbot: {
        enabled: false
      },
      sections: {}
    };

    const newSiteRes = await Site.create(newSite);
    const { __v, ...siteRes } = newSiteRes.toJSON();

    res.json({ success: true, message: 'Created', data: siteRes });
  } catch (err: any) {
    log(err);
    res.status(400).send({ success: false, message: err?.message || 'Something went wrong.' });
  }
};

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason });
};
