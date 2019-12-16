import { createServer } from "http";
import { createHmac } from "crypto";

//import http from 'http';
//import crypto from 'crypto';
const SECRET = 'MY_GITHUB_WEBHOOK_SECRET';
//http
  createServer((req, res) => {
    req.on('data', chunk => {
      const signature = `sha1=${
        createHmac('sha1', SECRET)
        .update(chunk)
        .digest('hex')}`;
      const isAllowed = req.headers['x-hub-signature'] === signature;
      const body = JSON.parse(chunk);
      const isMaster = body?.ref === 'refs/heads/master';
      if (isAllowed && isMaster) {
        // do something
      }
    });
    res.end();
  })
  .listen(9300);