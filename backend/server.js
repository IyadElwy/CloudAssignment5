const express = require("express");
const multer = require("multer");
///////
var cors = require("cors");

const { uploadFile, getFileStream, deleteObject } = require("./s3");
//////////

const upload = multer({ dest: "uploads/" });

////////////

// use it before all route definitions

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/files/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

app.delete("/files/:key", async (req, res) => {
  const key = req.params.key;
  await deleteObject(key);
  return res.send({});
});

app.post("/file", upload.single("file"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);

  res.send({ key: result.Key, description: req.body.description });
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
