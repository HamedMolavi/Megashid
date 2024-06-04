import axios from 'axios';
import https from "https";

let count = 0;
process.on("SIGINT", () => {
  console.log("TOTAL", count)
  process.exit(0);
})
console.log(process.pid);
function sendData(name: string) {
  const value = (Math.random() * 10 + 10).toFixed(1).toString();
  let data = JSON.stringify({
    "ts": Date.now(),
    "name": "data_1",
    value
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://localhost:3000/api/' + name,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'Megashid=s%3A4prRVeqdMHzTjn9j_6SUgm5_TUozY0mC.mAHQke8yWPecv146BO0c0G2qCDGcRCIWZyRMN43mcE4'
    },
    data: data,
    validateStatus: (status: number) => status >= 200 && status < 300,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };
  axios.request(config)
    .then((response) => {
      ++count;
      console.log(name, "SENT", count, value);
    })
    .catch((error) => {
      console.log(error);
      process.exit(0);
    });
}
setTimeout(() => {
  for (let i = 1; i <= 10; i++) {
    setInterval(() => sendData("con" + i), 100 + Math.random() * 10 + 10)
  }
}, 2000);