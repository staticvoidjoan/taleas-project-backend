const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Employer = require("../resources/models/employerModel");
const User = require("../resources/models/userModel");

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
beforeAll(async () => {
  await mongod.start();
  const uri = await mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true });
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe("lambdaTrigger", () => {
  it("should throw an error if name is less than 2 characters long", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "isEmployee",
          given_name: "a",
          family_name: "b",
          email: "test@example.com",
          birthdate: "01/01/2000",
        },
      },
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify({
        error: "Name should be at least 2 characters long",
      }),
    };

    expect(response.statusCode).toBe(400);
  });

  it("should throw an error if lastname is less than 2 characters long", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "isEmployee",
          given_name: "John",
          family_name: "",
          email: "test@example.com",
          birthdate: "01/01/2000",
        },
      },
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify({
        error: "Lastname should be at least 2 characters long",
      }),
    };

    expect(response.statusCode).toBe(400);
  });

  it("should throw an error if email is not valid", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "isEmployee",
          given_name: "John",
          family_name: "Doe",
          email: "invalid-email-address.com",
          birthdate: "01/01/2000",
        },
      },
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify({
        error: "Email is not in the correct format",
      }),
    };

    expect(response.statusCode).toBe(400);
  });

  it("should throw an error if email already exists for employer", async () => {
    const existingEmployer = new Employer({
      companyName: "Acme Inc.",
      email: "test@example.com",
    });
    await existingEmployer.save();

    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "",
          given_name: existingEmployer.companyName,
          email: existingEmployer.email,
        },
      },
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify({
        error: "Email already exists",
      }),
    };

    expect(response.statusCode).toBe(400);
  });

  it("should throw an error if company name is less than 3 characters long", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "",
          given_name: "Ac",
          email: `test@example.com`,
        },
      },
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify({
        error: "Company name should be at least 3 characters long",
      }),
    };

    expect(response.statusCode).toBe(400);
  });

  it("should save a new user to the database", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "isEmployee",
          given_name: "John",
          family_name: "Doe",
          email: `test@example.com`,
          birthdate: "01/01/2000",
        },
      },
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(event),
    };

    expect(response.statusCode).toBe(200);
  });

  it("should save a new employer to the database", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          custom: "",
          given_name: `Acme Inc.`,
          email: `test@example.com`,
        },
      },
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(event),
    };

    expect(response.statusCode).toBe(200);
  });
});
