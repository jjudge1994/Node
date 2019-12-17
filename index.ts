import { createServer } from "http";
import { createHmac } from "crypto";
import * as config from "config";
import { exec } from "child_process";
const SECRET = config.get("githubkey") ;

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
        const testscript = exec('cd /home/fgrayli && touch testfile.txt');

        testscript.stdout.on('data', function(data){
            console.log(data);
            // sendBackInfo();
        });
        
        testscript.stderr.on('data', function(data){
            console.log(data);
            // triggerErrorStuff();
        });
      }
    });
    res.end();
  })
  .listen(9300);