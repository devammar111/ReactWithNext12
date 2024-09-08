const { createServer } = require("https");
const next = require("next");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {}
if (dev) {
    const fs = require('fs');
    options.key = fs.readFileSync('anhc.key');
    options.cert = fs.readFileSync('anhc.crt');
}

app.prepare().then(() => {
    createServer(options, (req, res) => {
        handle(req, res);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
});