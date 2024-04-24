const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { startDatabase } = require("./database/mongo");
const { insertAd, getAds, deleteAd, updateAd } = require("./database/items");

const app = express();

const ads = [{ title: "Hello, world (again)!" }];

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

const PORT = process.env.PORT || 8080; // Use a different port than the Vite server

app.get("/", async (req, res) => {
  res.send(await getAds());
});

app.post("/", async (req, res) => {
  const newAd = req.body;
  await insertAd(newAd);
  res.send({ message: "New ad inserted." });
});

// endpoint to delete an ad
app.delete("/:id", async (req, res) => {
  await deleteAd(req.params.id);
  res.send({ message: "Ad removed." });
});

// endpoint to update an ad
app.put("/:id", async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: "Ad updated." });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertAd({ title: "Hello, now from the in-memory database!" });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Hello from the server!");
  });
});
