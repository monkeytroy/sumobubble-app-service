
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

      // process funny
      const configFunny = { ...custConfig.funny };
      
      // only going to return one funny item.
      custConfig.funny = {};

      // priority is the cust config items.  meme, then lines. 
      if (configFunny.meme) {
        custConfig.funny = { 
          meme: configFunny.meme
        }
      } else if (configFunny.lines) {
        custConfig.funny = {
          lines: configFunny.lines
        }
      }

      // if cust config does not have a funny set.. get daily
      if ((!custConfig?.funny?.lines || custConfig?.funny?.lines?.length === 0) && !custConfig?.funny?.meme) {
        try {
          const d = new Date();
          const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));
          const funnyRes = await db.collection("funny").find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);

          if (funnyRes) {
            const funnyResVals = await funnyRes.toArray();
            const funnyDaily = funnyResVals[0];
            
            // merge in the             
            if (funnyDaily.meme) {
              custConfig.funny = {
                meme: funnyDaily.meme
              }
            } else if (funnyDaily.lines) {
              custConfig.funny = {
                lines: funnyDaily.lines
              }
            }
          }
        } catch(err) {
          console.log('Could not pull in funny for today.', err);
        }
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
