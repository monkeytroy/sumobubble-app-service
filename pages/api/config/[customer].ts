
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import { connectToDb } from '@/services/mongodb';
import copyright from './copyright.json';
import { Db, WithId } from 'mongodb';

const copyrights: Copyrights = copyright;

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCRUFDT04iLCJuYW1lIjoiR2xvYmFsIiwiaWF0IjoxNTE2MTM5MDIyfQ.eVrEhwKxF4Dfj2S5fFFMnwLAae-E1h3Ilo9PQKgPYic';

const cors = Cors({
  methods: ['GET', 'GET', 'HEAD'],
});

const DEFAULT_TRANSLATION = 'ASV';


export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await midware(req, res, cors);

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

const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  try {
    const { customer } = req.query;
  
    // fetch the customer
    const { db } = await connectToDb();

    const custConfig = await db.collection("configurations").findOne({ customerId: customer}) as WithId<CustomerConfig>

    if (custConfig) {

      const d = new Date();
      const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

      getDailyFunny(db, custConfig);
      getDailyVerse(db, custConfig);
      
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

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  try {

    if (req.headers.authorization != JWT) {
      res.status(403).send({ success: false});
      return 
    }

    const { customer } = req.query;
    console.log(req.body);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // fetch the customer
    const { db } = await connectToDb();
    const configCol = db.collection("configurations");

    const custConfig = await configCol.findOne({ customerId: customer}) as WithId<CustomerConfig>

    if (custConfig) {

      if (typeof body.summaryContent !== 'undefined') {
        custConfig.summary.content = body.summaryContent;
      }
      if (typeof body.specialContent !== 'undefined') {
        custConfig.special.content = body.specialContent;
      }
      if (typeof body.contactEnabled !== 'undefined') {
        custConfig.contact.enabled = body.contactEnabled;
      }
      if (typeof body.contactContact !== 'undefined') {
        custConfig.contact.contact = body.contactContact;
      }
      if (typeof body.contactContent !== 'undefined') {
        custConfig.contact.content = body.contactContent;
      }
      if (typeof body.funnyEnabled !== 'undefined') {
        custConfig.funny.enabled = body.funnyEnabled;
      }
      if (typeof body.funnyMeme !== 'undefined') {
        custConfig.funny.meme = body.funnyMeme;
      }
      if (typeof body.funnyLines !== 'undefined') {
        custConfig.funny.lines = body.funnyLines;
      }
      if (typeof body.verseEnabled !== 'undefined') {
        custConfig.verse.enabled = body.verseEnabled;
      }
      if (typeof body.verseContent !== 'undefined') {
        custConfig.verse.content = body.verseContent;
      }
      if (typeof body.verseRef !== 'undefined') {
        custConfig.verse.verseRef = body.verseRef;
      }
      if (typeof body.verseTranslation !== 'undefined') {
        custConfig.verse.translation = body.verseTranslation;
      }
      if (typeof body.vodEnabled !== 'undefined') {
        custConfig.vod.enabled = body.vodEnabled;
      }
      if (typeof body.vodContent !== 'undefined') {
        custConfig.vod.content = body.vodContent;
      }
      if (typeof body.vodUrl !== 'undefined') {
        custConfig.vod.url = body.vodUrl;
      }

      const updateRes = await configCol.replaceOne({ customerId: customer}, custConfig);

      if (updateRes && updateRes.modifiedCount == 1) {
        res.status(200).json({ success: true, message: 'Updated', data: custConfig });  
        return;
      } else {
        console.log('Failed to update', updateRes, custConfig);
      }
      
      res.status(200).json({ success: false, message: 'Failed to update'});  

    } else {
      console.log('Could not get config for client: ' + customer);
      res.status(400).send({ success: false, message: 'No config found'});
    }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }

}

const getDailyVerse = async (db: Db, custConfig: CustomerConfig) => {
  
  const d = new Date();
  const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

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
}

const getDailyFunny = async (db: Db, custConfig: CustomerConfig) => {

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
}