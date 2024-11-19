import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';

const cors = Cors({
  methods: ['GET', 'HEAD']
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) {
  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET':
      //await get(req, res);
      break;
    case 'PUT':
      //await put(req, res);
      break;
    case 'POST':
      //await post(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}
