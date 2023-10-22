const Response = require("../apiResponses");
const AWS = require("aws-sdk");
const filter = require("bad-words");
const Comprehend = new AWS.Comprehend();
const profanityFilter = new filter();
const innapropriateWordSet = require("./innapropriateWordSet.json");

// Populate the filter with words from the "dataset"
innapropriateWordSet.dataset.forEach(word => {
  profanityFilter.addWords(word);
});
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(innapropriateWordSet)
  if (!body || !body.text) { 
    return Response._400({
      status: "error",
      message: "No text in the field body",
    });
  }

  const text = body.text;
 
  const params = {
    LanguageCode: "en",
    TextList: [text],
  };

  try {
    const entityResults = await Comprehend.batchDetectEntities(params).promise();
    const entities = entityResults.ResultList[0];

    const sentimentResults = await Comprehend.batchDetectSentiment(params).promise();
    const sentiments = sentimentResults.ResultList[0];
    const textSentiment = await Comprehend.detectSentiment(params);

    // Log specific properties without circular references
    console.log('Entities:', entities.Entities);
    console.log('Sentiments:', sentiments.Sentiment, sentiments.SentimentScore);
    console.log('Text Sentiment:', textSentiment.Sentiment, textSentiment.SentimentScore);

    const responseData = {
        entities: entities.Entities,
        sentiments: {
            Sentiment: sentiments.Sentiment,
            SentimentScore: sentiments.SentimentScore
        },
        textSentiment: {
            Sentiment: textSentiment.Sentiment,
            SentimentScore: textSentiment.SentimentScore
        },
        profanityDetected: false,
    };
    if(profanityFilter.isProfane(text)){
      responseData.profanityDetected = true;
    }

    return Response._200(responseData);
  } catch (error) {
    console.log("error", error);
    return Response._400({ message: "failed to work with Comprehend" });
  }
};
