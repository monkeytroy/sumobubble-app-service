
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import { connectToDb } from '@/services/mongodb';

const cors = Cors({
  methods: ['GET', 'GET', 'HEAD'],
});

type ConfigRes = {
  success: boolean,
  message: string,
  data: any
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ConfigRes | any>
) {

  await midware(req, res, cors);

  if (req.method !== 'GET') {
    res.status(405).send({ success: false, message: 'Only GET requests allowed' })
    return
  }

  try {
    const { customer } = req.query;
  
    // fetch the customer
    const { db } = await connectToDb();

    const custConfig = await db.collection("configurations").findOne({ customerId: customer});

    if (custConfig) {

      // add more data.
      try {
        const d = new Date();
        const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));
        const funnyRes = await db.collection("funny").find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);

        if (funnyRes) {
          const funnyResVals = await funnyRes.toArray();
          custConfig.funny.daily = funnyResVals[0]?.lines;
        }
      } catch {
        console.log('Could not pull in funny for today.');
      }

      res.status(200).json({ success: true, message: 'Message for you sir!', data: custConfig });
    } else {
      console.log('Could not get config for client: ' + customer);
      res.status(400).send({ success: false, message: 'No config found'});
    }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }
}
