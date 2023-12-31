import AWS from "aws-sdk";
const Responses = require("../apiResponses");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const s3 = new AWS.S3();

module.exports.uploadImages = async (event) => {
  console.log("Image parameters", JSON.stringify(event));
  const BUCKET_NAME = event.bucketName;

  let profilePhoto = event.profilePhoto;
  if (profilePhoto.startsWith('"') && profilePhoto.endsWith('"')) {
    profilePhoto = profilePhoto.slice(1, -1);
  }

  const isUrl = profilePhoto.startsWith("http://") || profilePhoto.startsWith("https://");

  if (!profilePhoto || (!isUrl && !profilePhoto.includes(","))) {
    console.log("Invalid or undefined profilePhoto");
    return Responses._400({ message: "Invalid or undefined profilePhoto" });
  }

  if (isUrl) {
    return Responses._200(profilePhoto);
  }

  const buffer = Buffer.from(profilePhoto.split(",")[1], "base64");

  const params = {
    Bucket: BUCKET_NAME,
    Key: "folder/" + Date.now() + ".jpg",
    Body: buffer,
    ContentType: "image/jpg",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);

    return Responses._201(data.Location);
  } catch (error) {
    console.log("General error", error);
    return Responses._500({ message: "Error uploading file" });
  }
};


// module.exports.uploadImages = async (event) => {
//   console.log("Image parameters", JSON.stringify(event));
//   const BUCKET_NAME = event.bucketName;

//   const img = event.profilePhoto;
//   if (!img || !img.includes(',')) {
//     console.log("Invalid or undefined profilePhoto");
//     return Responses._400({ message: "Invalid or undefined profilePhoto" });
//   }
//   const buffer = Buffer.from(img.split(",")[1], "base64");

//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: "folder/" + Date.now() + ".jpg",
//     Body: buffer,
//     ContentType: "image/jpg",
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     console.log(`File uploaded successfully. ${data.Location}`);

//     return Responses._201(data.Location);
//   } catch (error) {
//     console.log("General error", error);
//     return Responses._500({ message: "Error uploading file" });
//   }
// };
