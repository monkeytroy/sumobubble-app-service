
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import { connectToDb } from '@/services/mongodb';
import copyright from './copyright.json';
import { Db, WithId } from 'mongodb';
import SimpleCrypto from "simple-crypto-js"

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);
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

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason});
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
    const configCol = db.collection<CustomerConfig>("configurations");

    const custConfigRes = await configCol.findOne({ customerId: customer}) as WithId<CustomerConfig>
    const custConfig: CustomerConfig = custConfigRes ||  null;

    if (custConfig) {

      
      if (typeof body.pin !== 'undefined') {
        if (typeof body.pin != 'string' || body.summaryContent?.length > 4) {
          invalid(res, 'pin must be a string of 4 characters.');
          return;
        }
        const pin = body.pin;
        const encPin = crypto.encrypt(pin);
        custConfig.customerPin = encPin;
      }
      if (typeof body.summaryContent !== 'undefined') {
        if (typeof body.specialContent != 'string' || body.summaryContent?.length > 2000) {
          invalid(res, 'summaryContent must be a string is limited to 2k characters.');
          return;
        }
        custConfig.summary.content = body.summaryContent;
      }
      if (typeof body.specialContent !== 'undefined') {
        if (typeof body.specialContent != 'string' || body.specialContent?.length > 2000) {
          invalid(res, 'specialContent must be a string limited to 2k characters.');
          return;
        }
        custConfig.special.content = body.specialContent;
      }
      if (typeof body.contactEnabled !== 'undefined') {
        if (typeof body.contactEnabled != 'boolean') {
          invalid(res, 'contactEnabled must be boolean true or false.');
          return;
        }
        custConfig.contact.enabled = body.contactEnabled;
      }
      if (typeof body.contactContact !== 'undefined') {
        if (typeof body.contactContact != 'string' || body.contactContact?.length > 320 || body.contactContact.indexOf('@') < 0) {
          invalid(res, 'contactContact must be an email string limited to 320 characters');
          return;
        }
        custConfig.contact.contact = body.contactContact;
      }
      if (typeof body.contactContent !== 'undefined') {
        if (typeof body.contactContent != 'string' || body.contactContent?.length > 2000) {
          invalid(res, 'contactContent must be a string limited to 2k characters.');
          return;
        }
        custConfig.contact.content = body.contactContent;
      }
      if (typeof body.funnyEnabled !== 'undefined') {
        if (typeof body.funnyEnabled != 'boolean') {
          invalid(res, 'funnyEnabled must be boolean true or false.');
          return;
        }
        custConfig.funny.enabled = body.funnyEnabled;
      }
      if (typeof body.funnyMeme !== 'undefined') {
        if (typeof body.funnyMeme != 'string') {
          invalid(res, 'funnyMeme must be a url string');
          return;
        }
        custConfig.funny.meme = body.funnyMeme;
      }
      if (typeof body.funnyLines !== 'undefined') {
        if (typeof body.funnyLines != 'string' && !Array.isArray(body.funnyLines)) {
          invalid(res, 'funnyLines must be a string or array of strings');
          return;
        }
        if (Array.isArray(body.funnyLines) && body.funnyLines.length > 6) {
          invalid(res, 'funnyLines is limited to 6 lines.');
          return;
        }
        custConfig.funny.lines = body.funnyLines;
      }
      if (typeof body.verseEnabled !== 'undefined') {
        if (typeof body.verseEnabled != 'boolean') {
          invalid(res, 'verseEnabled must be boolean true or false.');
          return;
        }
        custConfig.verse.enabled = body.verseEnabled;
      }
      if (typeof body.verseContent !== 'undefined') {
        if (typeof body.verseContent != 'string' || body.verseContent?.length > 2000) {
          invalid(res, 'verseContent must be a string limited to 2k characters.');
          return;
        }
        custConfig.verse.content = body.verseContent;
      }
      if (typeof body.verseRef !== 'undefined') {
        if (typeof body.verseRef != 'string' || body.verseRef?.length > 100) {
          invalid(res, 'verseContent must be a string limited to 100 characters.');
          return;
        }
        custConfig.verse.verseRef = body.verseRef;
      }
      if (typeof body.verseTranslation !== 'undefined') {
        if (typeof body.verseTranslation != 'string' || body.verseTranslation?.length > 3) {
          invalid(res, 'verseTranslation must be a string limited to 3 characters.');
          return;
        }
        custConfig.verse.translation = body.verseTranslation;
      }
      if (typeof body.vodEnabled !== 'undefined') {
        if (typeof body.vodEnabled != 'boolean') {
          invalid(res, 'vodEnabled must be boolean true or false.');
          return;
        }
        custConfig.vod.enabled = body.vodEnabled;
      }
      if (typeof body.vodContent !== 'undefined') {
        if (typeof body.vodContent != 'string' || body.vodContent?.length > 2000) {
          invalid(res, 'vodContent must be a string limited to 2000 characters.');
          return;
        }
        custConfig.vod.content = body.vodContent;
      }
      if (typeof body.vodUrl !== 'undefined') {
        if (typeof body.vodUrl != 'string' || body.vodUrl?.length > 2000) {
          invalid(res, 'vodUrl must be a string url limited to 2000 characters.');
          return;
        }
        custConfig.vod.url = body.vodUrl;
      }

      const updateRes = await configCol.replaceOne({ customerId: customer}, custConfig);

      const { customerPin: string, ...custConfigRet} = custConfig;     
      //should db id be present or not?
      //delete custConfigRet._id;

      if (updateRes && updateRes.modifiedCount == 0 && updateRes.acknowledged) {
  
        res.status(200).json({ success: true, message: 'No changes detected', data: custConfigRet });  
        return;
      } else if (updateRes && updateRes.modifiedCount == 1) {
        res.status(200).json({ success: true, message: 'Updated', data: custConfigRet });  
        return;
      } else {
        console.log('Failed to update', updateRes, custConfigRet);
      }
      
      res.status(200).json({ success: false, message: 'Failed to update'});  

    } else {
      console.log('Could not get config for client: ' + customer);
      res.status(400).send({ success: false, message: 'No config found'});
      return;
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