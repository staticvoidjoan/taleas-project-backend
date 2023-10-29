const Response = require("../apiResponses");
const AWS = require("aws-sdk");
const filter = require("bad-words");
const Comprehend = new AWS.Comprehend();
const profanityFilter = new filter();
const innapropriateWordSet = require("./innapropriateWordSet.json");
const Translate = new AWS.Translate();

// Populate the filter with words from the "dataset"
innapropriateWordSet.dataset.forEach((word) => {
  profanityFilter.addWords(word);
});
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(innapropriateWordSet);
  if (!body || !body.text) {
    return Response._400({
      status: "error",
      message: "No text in the field body",
    });
  }

  const text = body.text;
  let translatedText = text; // Initialize translatedText with the original text

  const translationParams = {
    SourceLanguageCode: "auto",
    TargetLanguageCode: "en",
    Text: text,
  };

  try {
    const languageDetectionParams = {
      Text: text,
    };
    // Check if language is English before translating
    const languageDetectionResult = await Comprehend.detectDominantLanguage(
      languageDetectionParams
    ).promise();

    const detectedLanguage = languageDetectionResult.Languages[0].LanguageCode;
    console.log("LanguageDetectionResult", detectedLanguage);
    if (detectedLanguage != "en") {
      // If not English, translate
      const translationResult = await Translate.translateText(
        translationParams
      ).promise();
      translatedText = translationResult.TranslatedText; // Update translatedText
      console.log("TRanslationResult", translationResult)
      console.log("Normal text", text);
      console.log("Translated text", translatedText);
    }

    const params = {
      LanguageCode: "en",
      TextList: [translatedText],
    };
    const sentimentResults = await Comprehend.batchDetectSentiment(
      params
    ).promise();
    const sentiments = sentimentResults.ResultList[0];
    // Log specific properties without circular references
    console.log("Sentiments:", sentiments.Sentiment, sentiments.SentimentScore);

    const responseData = {
      sentiments: {
        Sentiment: sentiments.Sentiment,
        SentimentScore: sentiments.SentimentScore,
      },
      profanityDetected: false,
    };
    if (profanityFilter.isProfane(text)) {
      responseData.profanityDetected = true;
    }

    return Response._200(responseData);
  } catch (error) {
    console.log("error", error);
    return Response._400({ message: "failed to work with Comprehend" });
  }
};
