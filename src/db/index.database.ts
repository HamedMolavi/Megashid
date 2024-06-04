import connectToMongo from "./mongo/connect.database";
import connectToRedis from "./redis/connect.database";
import connectToInflux from "./influx/connect.database";

async function connectToDBs(urls: { mongo?: string[], redis?: string, influx?: string }) {
  let results: { [key: string]: any } = {};
  let connected = false;
  if (!!urls["mongo"]) {
    for await (const url of urls["mongo"]) {
      try {
        results["mongo"] = await connectToMongo(url);
        connected = true;
        break;
      } catch (error) {
        continue;
      };
    };
    if (!connected) process.exit(1);
  };
  if (!!urls["redis"]) results["redis"] = await connectToRedis(urls["redis"]);
  if (!!urls["influx"]) results["influx"] = await connectToInflux(urls["influx"], process.env["INFLUX_TOKEN"], 'Megashid', 'test');
  return results;
};

export default connectToDBs