const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { lambdaTrigger } = require("../resources/handlers/lambdaTriggerHandlers/lambdaTrigger"); // replace with your actual path
const User = require("../resources/models/userModel");
const Employer = require("../resources/models/employerModel");

jest.mock("../resources/config/dbConfig", () => ({
  connectDB: jest.fn(),
}));

let mongoServer;
let mongoUri;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("lambdaTrigger", () => {
  it("should create a User document when isEmployee is true", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          "custom:isEmployee": "true",
          "given_name": "Samuel",
          "family_name": "Dervishi",
          "email": "dervishisamuel360@gmail.com",
          "birthdate": "1990-01-01",
        },
      },
    };

    await lambdaTrigger(event);

    const user = await User.findOne({ email: event.request.userAttributes.email });
    expect(user).not.toBeNull();
    expect(user.name).toEqual(event.request.userAttributes.given_name);
    expect(user.lastname).toEqual(event.request.userAttributes.family_name);
  });

  it("should create an Employer document when isEmployee is false", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          "custom:isEmployee": "false",
          "given_name": "Artisti",
          "email": "artist@bar.com",
        },
      },
    };

    await lambdaTrigger(event);

    const employer = await Employer.findOne({ email: event.request.userAttributes.email });
    expect(employer).not.toBeNull();
    expect(employer.companyName).toEqual(event.request.userAttributes.given_name);
  });
});
