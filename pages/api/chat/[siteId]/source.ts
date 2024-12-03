import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import { log } from '@/services/log';
import { AskSourceRes, ConfigRes } from '../../site/types';
import { Fields, Files, IncomingForm, File } from 'formidable';
import fs from 'node:fs';
import connectMongo from '@/services/mongoose';
import AskSource, { IAskSource } from '@/models/askSource';
import { originalPathname } from 'next/dist/build/templates/app-page';

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'HEAD']
});

export const config = {
  api: {
    bodyParser: false // Disable Next.js's default body parser
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfigRes>) {
  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET':
      await getSourceDocs(req, res);
      break;
    case 'POST':
      await addSourceDoc(req, res);
      break;
    case 'DELETE':
      //await deleteSourceDoc(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}

/**
 * Not sure.  Maybe get chat history?
 */
const getSourceDocs = async (req: NextApiRequest, res: NextApiResponse<AskSourceRes>) => {
  const { siteId } = req.query;
  const siteIdVal = Array.isArray(siteId) ? siteId[0] : siteId;
  log(`api/chat/${siteIdVal}/source`);

  if (!siteIdVal) {
    return res.status(500).send({ success: false, message: 'Missing site id' });
  }

  try {
    await connectMongo();

    const sources = await AskSource.find(
      { siteId: siteIdVal, isMaster: false },
      {
        customerId: 1,
        siteId: 1,
        contents: 1,
        origFilename: 1
      }
    );

    res.status(200).send({ success: false, message: `Sources for site ${siteIdVal}`, data: sources });
  } catch (err) {
    res.status(500).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};

/**
 * User posted chat message - todo figure out
 *
 * @param req
 * @param res
 * @returns
 */
const addSourceDoc = async (req: NextApiRequest, res: NextApiResponse<ConfigRes>) => {
  const { siteId } = req.query;

  const siteIdVal = Array.isArray(siteId) ? siteId[0] : siteId;

  log(`api/chat/${siteIdVal}/source`);

  if (!siteIdVal) {
    return res.status(500).send({ success: false, message: 'Missing site id' });
  }

  try {
    // read the file data.
    const form = new IncomingForm();
    const [fields, files]: [Fields, Files] = await form.parse(req);
    const uploadFiles: File[] | undefined = files['upload'];

    if (!uploadFiles) {
      const message = 'Failed to get upload file';
      return res.status(404).json({ success: false, message });
    }

    // for all files..
    const processFiles = uploadFiles.map((v) => ({
      filepath: v.filepath,
      mimetype: v.mimetype,
      originalFilename: v.originalFilename,
      success: false,
      message: ''
    }));

    await connectMongo();

    for (const file of processFiles) {
      const originalFilename = file.originalFilename;

      if (file.mimetype !== 'text/plain') {
        file.success = false;
        file.message = 'File type not supported.  Must be text/plain';
      } else if (!originalFilename) {
        file.success = false;
        file.message = 'Filename was not found.';
      } else {
        // extract file contents
        // first draft only support text files.
        const contents = await fs.readFileSync(file.filepath, 'utf8');
        file.success = true;

        // todo consider how to de-dup contents best.
        // option 1 to start - unique file name
        // option 2 check for dup contents in other files?

        const askSource: IAskSource = {
          customerId: '',
          siteId: siteIdVal,
          isMaster: false,
          origFilename: originalFilename,
          contents
        };

        const askSourceRec = await AskSource.findOneAndUpdate({ origFilename: file.originalFilename }, askSource, {
          new: true,
          upsert: true
        });
      }
    }

    // regenerate the master source doc and store
    // get all the docs for this site.
    const sources = await AskSource.find({ siteId: siteIdVal });

    // join using separator
    let masterSource = '';
    for (const source of sources) {
      masterSource += '/n----------DocStart----------' + source.contents;
    }

    // write to source record
    const masterRec = await AskSource.findOneAndReplace(
      { siteId: siteIdVal, isMaster: true },
      {
        customerId: '',
        siteId: siteIdVal,
        isMaster: true,
        contents: masterSource
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({ success: true, message: 'Ok' });
  } catch (err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};
