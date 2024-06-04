//import this file to correct global and modular types
import { } from "./types/index";
//initial file .env
require("./config/env.config")["default"](); //sync
//process error handling
require("./error/process.handler")["default"](); //sync
//imports
import http from "http";
import https from "https";
import app from "./app/app.Application";
import setup from "./setups/index";
import { run } from "./interactive/index.cluster";


async function main() {
  setup().then(_ => {
    const { OPTIONS, PORT_HTTPS, PORT_HTTP, HOST } = process.env;
    //                             SETUP YOUR SERVERS
    ////////////////////////////////////////////////////////////////////////////
    // run https server on port PORT_HTTPS
    const httpsServer = https.createServer(JSON.parse(OPTIONS as string), app).listen(PORT_HTTPS, () => {
      console.log(`Server is running on https://${HOST}:${PORT_HTTPS}`);
    }).on('error', errorHandler);

    // run http server on port PORT_HTTP
    const httpServer = http.createServer(
      // (req, res) => {
      //   res.writeHead(301, { Location: `https://${req.headers.host?.split(":")?.[0]}:${PORT_HTTPS}${req.url}` });
      //   res.end();
      // }
      app
    ).listen(PORT_HTTP, () => {
      console.log(`Server is running on http://${HOST}:${PORT_HTTP}`);
    }).on('error', errorHandler);
    ////////////////////////////////////////////////////////////////////////////

    function errorHandler(error: { syscall: string, code: string }) {
      if (error.syscall !== 'listen') throw error; // handeling only listen errors
      const bind = typeof PORT_HTTPS === 'string'
        ? 'Pipe ' + PORT_HTTPS
        : 'Port ' + PORT_HTTPS;
      switch (error.code) { // handle errors properly
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
        default:
          console.error(error);
      }
      process.exit(1);
    };
  })
};
run(main);