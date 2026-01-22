import express from 'express'
const router = express.Router();

import AWS from 'aws-sdk';
import fs  from 'fs';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.get('/', async (req, res) => {
    console.log("router / get / ")
    res.render('index');
});


export default router;