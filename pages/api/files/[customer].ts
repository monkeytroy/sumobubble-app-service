import connectMongo from "@/services/mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import Cors from 'cors';
import { apiMiddleware } from "@/services/api-middleware";
import formidable from "formidable";
import fs from 'fs';
import { log } from "@/services/log";
import { UUID } from "bson";

const spacesUrl = process.env.SPACES_BUCKET_URL;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  methods: ['GET', 'GET', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      //await get(req, res);
      break;
    case 'PUT':
      await put(req, res);
      break;
    case 'POST':
      //await post(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

/**
 * Get the s3 client to access objects
 * @returns 
 */
const getS3Client = () => {
  
  const s3Client = new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: process.env.SPACES_ENDPOINT,
    region: process.env.SPACES_REGION,
    credentials: {
      accessKeyId: process.env.SPACES_KEY || '',
      secretAccessKey: process.env.SPACES_SECRET || ''
    }
  });

  return s3Client;
}

/**
 * parse the form data for file uplaods.
 * @param req Parse the form
 * @returns 
 */
const parseForm = (req: NextApiRequest) => new Promise<{ fields: any, files: any }>((resolve, reject) => {
    // get the file info from the request.
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 5 * (1024 * 1024),
      filter: (part: any) => {
        return (
          part.name === "file" && (part.mimetype?.includes("image/") || false)
        );
      }
    });

    form.parse(req, async function (err: any, fields: any, files: any) {
      if (err) {
        reject(err);
      }
      resolve({fields, files});
    });
  }
);

/**
 * Put / Save a new file.
 * @param req 
 * @param res 
 * @returns 
 */
const put = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  
  try {
    await connectMongo();
    
    const { customer } = req.query;

    // get the file info from the request.
    const {files} = await parseForm(req);
    
    if (files && files.file) {
      const theFile = files?.file[0];
      
      const blob = fs.readFileSync(theFile.filepath);
      const uuid = new UUID();
      const objectKey = `customers/${customer}/${uuid}`;

      const fileParams = {
        Bucket: `info-beacon-1`,
        ACL: 'public-read',
        Key: objectKey,
        Body: blob
      };
      
      // save the file 
      const s3Client = getS3Client();
      
      const putObjectRes = await s3Client.send(new PutObjectCommand(fileParams));

      log(putObjectRes);

      if (putObjectRes.$metadata.httpStatusCode == 200) {
        res.json({ success: true, message: 'Created', data: {
          url: `${spacesUrl}/${objectKey}`
        } });  
      } else { 
        res.status(400).send({ success: false, message: 'File could not be stored.'});
      }
    } else {
      res.status(400).send({ success: false, message: 'File data could not be read'});
    }
  } catch (err: any) {
    console.log(err);
    res.status(400).send({ success: false, message: err?.message});
  }  

}