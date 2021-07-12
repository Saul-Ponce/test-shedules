const express = require("express");
const app = express();
const axios = require("axios");
const schedule = require("node-schedule");
const port = process.env.PORT || 4000;
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

app.get("/", (req, res) => {
  res.json({
    msg: "/ route",
  });
});

app.get("/segundos/:x", (req, res) => {
  const { x: minuto } = req.params;

  /* const fechaFake = "2021-07-12T05:15:26.783Z";

  const fechaAustralia = dayjs(fechaFake).tz("Australia/Sydney"); */

  //   const fecha = dayjs(fechaAustralia.toISOString()).tz(dayjs.tz.guess(), true);
  const fecha = dayjs().tz(dayjs.tz.guess(), true);

  const job = schedule.scheduleJob(
    fecha.add(minuto, "seconds").toDate(),
    async function () {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/1"
      );

      await fs.writeFileSync(
        path.resolve(__dirname, new Date().getTime() + ".json"),
        JSON.stringify(data),
        { encoding: "utf-8" }
      );
    }
  );
  res.json({
    minuto,
    fecha,
    zona: dayjs.tz.guess(),
  });
});

app.listen(port, () => {
  console.log(`servidor corriendo en puerto ${port}`);
});
