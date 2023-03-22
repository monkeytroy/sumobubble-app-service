
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import { connectToDb } from '@/services/mongodb';
import copyright from './copyright.json';

interface Copyrights {
  [name: string]: string;
}

const copyrights: Copyrights = copyright;

const cors = Cors({
  methods: ['GET', 'GET', 'HEAD'],
});

const DEFAULT_TRANSLATION = 'ASV';

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

      const d = new Date();
      const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

      // if cust config does not have a funny set.. get daily
      if (custConfig?.funny?.enabled && 
          (!custConfig?.funny?.lines || custConfig?.funny?.lines?.length === 0) && 
            !custConfig?.funny?.meme) {
        try {
          const funnyRes = await db.collection("funny").find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);

          if (funnyRes) {
            const resVals = await funnyRes.toArray();
            const daily = resVals[0];
            
            // merge in the             
            if (daily?.meme) {
              custConfig.funny.meme = daily.meme;
            } else if (daily?.lines) {
              custConfig.funny.lines = daily.lines;
            }
          }
        } catch(err) {
          console.log('Could not pull in funny for today.', err);
        }
      }

      const trans = custConfig.verse.translation || DEFAULT_TRANSLATION;
      // get translation copyright. 
      custConfig.verse.copyright = copyrights[trans] || '';

      // if cust config does not have a verse set.. get daily
      if (custConfig?.verse?.enabled && 
        (!custConfig?.verse?.verseRef || !custConfig?.verse?.content)) {
        try {
          const verseRes = await db.collection("verse").find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);

          if (verseRes) {
            const resVals = await verseRes.toArray();
            const daily = resVals[0];
            
            // merge in the             
            custConfig.verse.verseRef = daily.verseRef;

            // find the translation
            const content: string = daily.verses[trans];
            custConfig.verse.content = content;

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
