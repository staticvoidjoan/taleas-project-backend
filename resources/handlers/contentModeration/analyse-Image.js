const AWS = require("aws-sdk");
const axios = require("axios");
const Response = require("../apiResponses");
const s3 = new AWS.S3();

async function getImageData(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Error fetching image data:", error);
    throw error;
  }
}

const uploadImage = async (base64) => {
    console.log("Trying to upload the image to s3")
  console.log("Image parameters", JSON.stringify(base64));
  const BUCKET_NAME = "employerprofileimagebucket";
  const img = base64;
  const buffer = Buffer.from(img.split(",")[1], "base64");
  const params = {
    Bucket: BUCKET_NAME,
    Key: "folder/" + Date.now() + ".jpg",
    Body: buffer,
    ContentType: "imgage/jpg",
  };

  try {
    console.log("Inside s3 upload try and catch")
    const data = await s3.upload(params).promise();
    console.log(`File to check uploaded successfully.${data.Location}`);
    console.log("Upload to s3 successfull")
    return data.Location;
  } catch (error) {
    console.log("General error", error);
    return Response._500({ message: "Error uploading file" });
  }
};

const rekognition = new AWS.Rekognition();
exports.handler = async (event, context) => {
  try {
    console.log("The base64 image ", event.body)
    const body = JSON.parse(event.body);

    const imageUrl = await uploadImage(body.imageUrl);
    console.log("The image url",imageUrl)
    const rekognitionParams = {
      Image: {
        Bytes: await getImageData(imageUrl),
      },
    };

    let isImageDeleted = false;
    const moderationLabelsResponse = await rekognition
      .detectModerationLabels(rekognitionParams)
      .promise();

    const moderationLabels = moderationLabelsResponse.ModerationLabels;
    let detectionStatus = "Good";

    if (moderationLabels && moderationLabels.length > 0) {
      console.log("Bad Image detected");
      detectionStatus = "Bad";
      isImageDeleted = true;
      // Delete the image from S3
      const BUCKET_NAME = "employerprofileimagebucket";
      const key = "folder/" + Date.now() + ".jpg";
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: key,
      };
    console.log("Deleteing bad image")
      try {
        console.log("Trying to delete bad image")
        await s3.deleteObject(deleteParams).promise();
        console.log(`Image deleted from S3: ${key}`);
      } catch (error) {
        console.error("Error deleting image from S3:", error);
      }
    }

    return Response._200({
      detectionStatus: detectionStatus,
      isImageDeleted: isImageDeleted,
    });
  } catch (error) {
    console.error("Error analyzing the image:", error);
    throw error;
  }
};
