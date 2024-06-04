import dotenv from "dotenv";
import fs from "fs";
import { join } from "path";


export default function extraEnvConfigs() {
  try {
    dotenv.config({ path: join(__dirname, "../../.env"), encoding: 'utf8', debug: false, override: true });
    //read key and cert from files for certificate in https server
    const key = fs.readFileSync(join(__dirname, "./../../ssl/server.key"), "utf-8");
    const cert = fs.readFileSync(join(__dirname, "./../../ssl/server.crt"), "utf-8");
    process.env["OPTIONS"] = JSON.stringify({
      key: key,
      cert: cert,
    });
  } catch (err) {
    console.error("Error in reading key and pem...");
    console.error(err);
    process.exit(1);
  };
};
