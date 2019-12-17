"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const crypto_1 = require("crypto");
const config = require("config");
const child_process_1 = require("child_process");
const SECRET = config.get("githubkey");
http_1.createServer((req, res) => {
    req.on('data', chunk => {
        var _a;
        const signature = `sha1=${crypto_1.createHmac('sha1', SECRET)
            .update(chunk)
            .digest('hex')}`;
        const isAllowed = req.headers['x-hub-signature'] === signature;
        const body = JSON.parse(chunk);
        const isMaster = ((_a = body) === null || _a === void 0 ? void 0 : _a.ref) === 'refs/heads/master';
        if (isAllowed && isMaster) {
            const testscript = child_process_1.exec('sh deploy.sh /home/fgrayli/projects/Node');
            testscript.stdout.on('data', function (data) {
                console.log(data);
            });
            testscript.stderr.on('data', function (data) {
                console.log(data);
            });
        }
    });
    res.end();
})
    .listen(9300);
//# sourceMappingURL=index.js.map