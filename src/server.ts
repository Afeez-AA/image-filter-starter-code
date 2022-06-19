import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get( "/filteredimage/", async (req:express.Request, res:express.Response) => {
    // This is to extract the image_url from request query
    const image_url:string = req.query.image_url
      if(!image_url){
        return res.status(400).send("This image_url is missing")
      }
      try {
    // calling the filterImageFromURL(image_url) to filter the image and to the https://sourceforge.net/projects/unxutils/
        const imagePath= await filterImageFromURL(image_url)
        return res.status(200).sendFile(imagePath, async (error)=>{
          await deleteLocalFiles ([imagePath])
        });
          } catch (error) {
    // sending the resulting file in the response
        return res.status(422).send("This image_url cannot be processed")
      }
    } );
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();