const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const maxmind = require("maxmind");

app.set("trust proxy", true);

const dbPath = path.join(process.cwd(), "GeoLite2-City.mmdb");

let lookup;

// Initialize the database lookup
async function initializeDatabase() {
  try {
    lookup = await maxmind.open(dbPath);
    console.log("✅ GeoLite2 database loaded");
  } catch (error) {
    console.error("❌ Failed to load GeoLite2 DB:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World from analytics server");
});

app.get("/analytics/maxmind", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;

  console.log(`Analytics received from ${ip}`);

  console.log(req.ip);
  console.log(req.socket.remoteAddress);

  if (!lookup) {
    return res.status(500).json({ error: "GeoDB not loaded yet" });
  }

  const geo = lookup.get(ip);

  res.json({
    ip,
    city: geo?.city?.names?.en || null,
    country: geo?.country?.names?.en || null,
    latitude: geo?.location?.latitude || null,
    longitude: geo?.location?.longitude || null,
  });
});

app.get("/analytics/api", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;
  // const ip = "98.97.79.166";
  const url = `http://ip-api.com/json/${ip}`;
  //   const url = `https://geo.ipify.org/api/v2/country?apiKey=at_Fcr73oayP6SY3tcPAXQLVumG2XpTx&ipAddress=${ip}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
async function startServer() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch(console.error);
