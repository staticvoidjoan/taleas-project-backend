const AWS = require('aws-sdk');
const axios = require('axios'); 
const Response = require("../apiResponses");

async function getImageData(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error('Error fetching image data:', error);
        throw error;
    }
}
exports.handler = async (event, context) => {
    const rekognition = new AWS.Rekognition();

    try {
        const body = JSON.parse(event.body);
        const imageUrl = body.imageUrl;
        console.log(event.body.imageUrl);
        const rekognitionParams = {
            Image: {
                Bytes: await getImageData(imageUrl)
            }
        }

        const moderationLabelsResponse = await rekognition.detectModerationLabels(rekognitionParams).promise();

        const moderationLabels = moderationLabelsResponse.ModerationLabels;
        let detectionStatus = "Good";

        if (moderationLabels && moderationLabels.length > 0) {
            console.log("Bad Image detected");
            detectionStatus = "Bad";
        }

      

        return Response._200(detectionStatus);

    } catch (error) {
        console.error('Error analyzing the image:', error);
        throw error;
    }
}
