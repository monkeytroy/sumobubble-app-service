
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import { Translation, translations } from '@/services/translations';
import SimpleCrypto from "simple-crypto-js"
import connectMongo from '@/services/mongoose';
import Verse from '@/models/verse';
import { log } from '@/services/log';

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await midware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      await get(req, res);
      break;
    case 'PUT':
      //await put(req, res);
      break;
    case 'POST':
      //await post(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  try {
    
    await connectMongo();

    const authToken = (req.headers.authorization || '').split("Bearer ")[1];
    if (authToken != process.env.API_TOKEN) {
      res.status(403).send({ success: false, message: 'Unauthorized' });
      return;
    }

    // get date today.
    const d = new Date();
    const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

    // try to get todays verse.
    const verseRes = await Verse.findOne({day: findToday });
    log('verseRes:', verseRes);

    if (!verseRes) {
        
      const vod: IVod = {
        verseRef: '',
        day: findToday,
        verses: new Map<string, string>()
      };

      // walk thru the translation list and fetch each one. 
      for (const trans in Translation) {

        const vodRes = await fetch(`https://www.biblegateway.com/votd/get/?format=json&version=${trans}`);
        const vodResJson = await vodRes.json();

        if (vodResJson?.votd?.content && vodResJson?.votd?.reference) {
          vod.verses.set(trans, vodResJson?.votd?.content);
          vod.verseRef = vodResJson?.votd?.reference;
        }

        console.log(vodResJson);
      }

      console.log(vod);

      const vodCreated = await Verse.create(vod);
      const { __v, ...configurationRes} = vodCreated.toJSON();  

      res.status(200).send({ success: false, message: 'Created', data: configurationRes })  

    } else {
      res.status(200).send({ success: false, message: 'Already updated' })  
    }
  
  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }
}