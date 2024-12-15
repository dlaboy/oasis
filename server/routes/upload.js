const { google } = require('googleapis');
const multer = require('multer');
var express = require('express');
const fs = require('fs')

const upload = multer({ dest: 'uploads/' });



const router = express.Router();

const dotenv = require('dotenv');


dotenv.config();




// const multer = Multer({
//   storage: Multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, `${__dirname}/audio-files`);
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     },
//   }),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });


const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    // keyFile: `${__dirname}/fluted-oasis-433605-f6-aa5c5ad4da53.json`,
    credentials: JSON.parse(process.env.GOOGLE_KEY),
    // keyFile: process.env.GOOGLE_FILE,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};


const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
      name: file.originalname,
      parents: ["1pYr1jaHdOM8vBw-IZc-rk3LHBlJPC1v6"], // Change it according to your desired parent folder id
    };
  
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    return response;
  };

  const deleteFile = (filePath) => {
    fs.unlink(filePath, () => {
      console.log("file deleted");
    });
  };

router.post("/", upload.single("file"), async function (req, res, next) {
try {
    if (!req.file) {
    console.log("Upload Failed")

    res.status(400).send("No file uploaded.");
    return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    console.log("Upload Successfull")
    res.status(200).json({ response });
} catch (err) {
    console.log(err);
}
});

module.exports = router