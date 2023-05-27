
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import { log } from '@/services/log';
import Site from '@/models/site';
import { getS3Client } from '@/services/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const cors = Cors({
  methods: ['POST', 'DELETE', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'POST':
      await post(req, res);
      break;
    case 'DELETE': 
      //await deleteSite(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason});
}

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  
  const { siteId } = req.query;
  
  log(`api/site/${siteId}/publish {POST}`);

  try {
    await connectMongo();

    const site = await Site.findOne({ _id: siteId }); 

    if (site) {

      // remove unnecessary fields
      const { __v, ...siteRes} = site.toJSON();

      // massage any data
      const spotlight = siteRes.sections['spotlight'];
      if (spotlight) {
        let spotlightUrl = spotlight?.urls[0];
        if (spotlightUrl.indexOf('watch?v=') > 0) {
          spotlightUrl = spotlightUrl.replace('watch?v=', 'embed/');
          spotlight.urls = [spotlightUrl];
        }
      }

      // write file to space.
      const s3Client = getS3Client();

      const objectKey = `sites/${siteId}.json`;

      const fileParams = {
        Bucket: process.env.SPACES_BUCKET,
        ACL: 'public-read',
        Key: objectKey,
        Body: JSON.stringify(siteRes),
        ContentType: "application/json"
      };

      log('Writing object to spaces: ', fileParams);

      const putObjectRes = await s3Client.send(new PutObjectCommand(fileParams));

      log(putObjectRes);

      if (putObjectRes.$metadata.httpStatusCode == 200) {
        res.status(200).json({ success: true, message: 'Published', data: siteRes });  
      } else { 
        res.status(400).send({ success: false, message: 'Failed to publish site file'});
      }
    } else {
      log('Could not publish siteId: ' + siteId);
      invalid(res, 'Failed to publish');
      return;
    }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }

}
