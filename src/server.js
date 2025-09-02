const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.set("trust proxy", true);

app.post("/analytics", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;

  console.log(`Analytics received from ${ip}`);

  console.log(req.ip);
  console.log(req.socket.remoteAddress);

  res.send("Analytics received ", ip);
});
