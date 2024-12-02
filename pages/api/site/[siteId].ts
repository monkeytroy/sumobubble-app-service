import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import { log } from '@/services/log';
import Site from '@/models/site';
import { ConfigRes, ISite } from './types';

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'HEAD']
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
    case 'DELETE':
      await deleteSite(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  try {
    await connectMongo();

    const { siteId } = req.query;
    log(`GET: api/site/${siteId}`);

    const site = await Site.findById(siteId).select('-__v');

    // fetch the customer
    if (site) {
      res.status(200).json({ success: true, message: 'Message for you sir!', data: site.toJSON() });
    } else {
      const message = `Config was not found for site ${siteId}`;
      console.log(message);
      res.status(404).json({ success: false, message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: `Error ${(<Error>err)?.message}` });
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  // route should be protected in middleware - disabled for the moment.
  // const session = await getToken({ req, secret: process.env.JWT_SECRET })
  // early exit if not authorized.
  // if (!session) {
  //   res.status(403).send({ success: false, message: 'Unauthorized'});
  //   return
  // }

  const { siteId } = req.query;
  log(`POST: api/site/${siteId}`);

  try {
    await connectMongo();

    const siteConfig: ISite = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // massage the spotlight urls if needed
    // todo - verify UI should not let it get this far
    const spotlight = siteConfig.sections['spotlight'];
    if (spotlight?.urls) {
      let spotlightUrl = spotlight.urls[0];
      if (spotlightUrl.indexOf('watch?v=') > 0) {
        spotlightUrl = spotlightUrl.replace('watch?v=', 'embed/');
        spotlight.urls = [spotlightUrl];
      }
    }

    // find or create
    const site = await Site.findOneAndUpdate({ _id: siteId }, siteConfig, {
      new: true
    });

    if (site) {
      const { __v, ...siteRes } = site.toJSON();
      res.status(200).json({ success: true, message: 'Updated', data: siteRes });
    } else {
      log('Could not update siteId: ' + siteId);
      res.status(500).json({ success: false, message: 'Failed to update' });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: `Error ${(<Error>err)?.message}` });
  }
};

const deleteSite = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  const { siteId } = req.query;
  log(`DELETE: api/site/${siteId}`);

  try {
    await connectMongo();

    const deleteRes = await Site.findOneAndDelete({ _id: siteId });

    if (deleteRes) {
      res.status(200).json({ success: true, message: 'Updated' });
    } else {
      res.status(404).json({ success: true, message: 'Could not remove site' });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: `Error ${(<Error>err)?.message}` });
  }
};

// disabled for now
// const getDailyFunny = async (siteConfig: any) => {
//   log('getDailyFunny -------------------------------------------------------');
//   const funny = JSON.parse(JSON.stringify(siteConfig.sections.get('funny') || {}));

//   if (funny && funny.enabled) {
//     const d = new Date();
//     const findToday = parseInt(d.toISOString().split('T')[0].replace(/\-/g, ''));

//     log('funny: ', funny);

//     if (funny?.props?.autoFill) {
//       // fall back on disabled
//       funny.enabled = false;
//       try {
//         const funnyRes: Array<IFunny> = await Funny.find({ day: { $lte: findToday } })
//           .sort({ day: -1 })
//           .limit(1);
//         //log('funnyRes: ', funnyRes);

//         if (funnyRes[0]) {
//           const daily = funnyRes[0];
//           log('daily: ', daily, daily.urls);

//           // merge in the funny lines.
//           funny.content = daily.content;
//           funny.urls = [...daily.urls];
//           log('funny: ', funny);

//           funny.enabled = true;
//           siteConfig.sections.set('funny', funny);
//           log('getDailyFunny is setting funny section to: ', siteConfig);
//         }
//       } catch (err) {
//         console.log('Could not pull in funny for today.', err);
//       }
//     }
//   } else {
//     log('funny: No funny section detected to fill with daily');
//   }
// };
