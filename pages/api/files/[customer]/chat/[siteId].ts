import connectMongo from "@/services/mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors';
import { apiMiddleware } from "@/services/api-middleware";
import formidable from "formidable";
import crypto from 'crypto';
import { TextLoader } from "langchain/document_loaders/fs/text";
import SiteChatDoc, { ISiteChatDoc } from "@/models/siteChatDoc";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const config = {
  api: {
    bodyParser: false,
  }
};

const cors = Cors({
  methods: ['PUT', 'HEAD']
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'PUT':
      await put(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

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
          part.name === "file" && (part.mimetype?.includes("text/") || false)
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
    
    const { customer, siteId } = req.query;

    const customerVal = Array.isArray(customer) ? customer[0] : customer;
    const siteIdVal = Array.isArray(siteId) ? siteId[0] : siteId;

    console.log(`/api/files/chat/customer ${customerVal}`);

    // get the file info from the request.
    const { files } = await parseForm(req);
    console.log('Files:', files);

    if (siteIdVal && customerVal && files && files.file) {
      console.log('Found file');

      // todo support multi
      const theFile = files?.file[0];
    
      //console.log(theFile);
      
      const origFilename = theFile.originalFilename;

      // todo for each file.. multiples.

      // create index from filename. 
      const fileHash = crypto.createHash('sha1').update(origFilename).digest('hex');

      // get docs
      const docs: Array<any> = await docsFromText(theFile.filepath);

      // add file hash to md to prevent duplicates. 
      docs.forEach((val, index) => {
        val.metadata.fileHash = fileHash;
      });

      // write to db?  To reindex all docs allways? 

      // const newSiteChatDoc: ISiteChatDoc = {
      //   customerId: customerVal,
      //   origFilename: origFilename,
      //   filenameKey: fileHash,
      //   doc: docs
      // }

      // write docs to mongo
      //const newDocRes = await SiteChatDoc.create(newSiteChatDoc);
      //const { __v, ...chatDocRes} = newDocRes.toJSON(); 
      
      // add to index
      indexDocsHNSWLib(docs, siteIdVal);

      res.json({ 
        success: true, 
        message: 'Indexed', 
        data: {
          fileHash
        } 
      });  

    } else {
      res.status(400).send({ success: false, message: 'File data could not be read'});
    }
  } catch (err: any) {
    console.log(err);
    res.status(400).send({ success: false, message: err?.message});
  }  

}

const docsFromText = async (docPath: string) => {
  const loader = new TextLoader(docPath);
  const docs = await loader.load();

  //const fileId = docPath.replaceAll('/', '_');
  //const path = `./docs/${siteId}`;
  //const file = `/text_${fileId}.json`;
  //await writeDocsToFile(path, file, docs);

  return docs;    
}

export const indexDocsHNSWLib = async (docs: Array<any>, siteId: string) => {

  try {
    console.log('Connected for indexText');

    if (docs) {

      console.log('Trying to load existing vector store');

      let vectorStore: HNSWLib | null = null;
      const docsToAdd: Array<any> = [];

      try {
        vectorStore = await HNSWLib.load(`db/${siteId}`, new OpenAIEmbeddings());
        if (vectorStore) {
          console.log('Found vector store');

          docs.map((doc: any, docIdx: number) => {
            console.log('Looking for dups for doc ' + docIdx);

            let found = false;
            const vectorStoreDocs = vectorStore?.docstore._docs;
            if (vectorStoreDocs) {
              for (const [key, value] of vectorStoreDocs) {
                // console.log('Checking ' + 
                //   doc.metadata.fileHash + ' against ' + 
                //   doc.metadata.fileHash);

                if (value.metadata?.fileHash == doc.metadata?.fileHash) {
                  console.log('Found one to be existing.');
                  found = true;
                }
              };
            }

            if (!found) {
              console.log('Didnt find one.  Adding the doc');
              docsToAdd.push(doc);
              console.log('Doc added');
            }
          });

        } else {
          console.log('Vectorstore not found');
        }
        
      } catch (err) {
         console.log('Could not load!!!', err);
      }

      if (!vectorStore) {
        vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
      } else {
        await vectorStore?.addDocuments(docsToAdd);
      }

      console.log('Saving the store');
      await vectorStore.save(`db/${siteId}`);
      console.log('Saved!');
      
      console.log('Created index from doc');
      return true;

    } 
  } finally {
  }

  return false;
}