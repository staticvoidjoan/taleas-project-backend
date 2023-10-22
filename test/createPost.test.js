const { createPost } = require("../resources/handlers/postHandlers/createPost");
const Post = require("../resources/models/postModel");
const Employer = require("../resources/models/employerModel");
const {connectDB} = require("../resources/config/dbConfig");

jest.mock("../resources/config/dbConfig");
jest.mock("../resources/models/employerModel");
jest.mock("../resources/models/postModel");

describe("createPost", () => {
    it("creates a post successfully", async () => {
        const mockEmployer = { _id: "651998e5e88d4b85c0ebb8de", postsMade: 0, maxPosts: 5, save: jest.fn() };
        const mockEvent = { 
            pathParameters: { creatorId: "651998e5e88d4b85c0ebb8de" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1", requirements: "requirements1", description: "description1" })
        };
    
        Post.mockImplementation(() => ({ save: jest.fn() }));
        Employer.findById.mockResolvedValue(mockEmployer);
        connectDB.mockResolvedValue();
    
        const response = await createPost(mockEvent);
    
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
    });
    

    it("returns 400 when not all required fields are provided", async () => {
        const mockEvent = { 
            pathParameters: { creatorId: "651998e5e88d4b85c0ebb8de" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1" })
        };

        connectDB.mockResolvedValue();

        const response = await createPost(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
    });

    it("returns 400 when the employer ID is not valid", async () => {
        const mockEvent = { 
            pathParameters: { creatorId: "invalidEmployerId" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1", requirements: "requirements1", description: "description1" })
        };

        connectDB.mockResolvedValue();

        const response = await createPost(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
    });

    it("returns 404 when the employer is not found", async () => {
        const mockEvent = { 
            pathParameters: { creatorId: "651998e5e88d4b85c0ebb8de" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1", requirements: "requirements1", description: "description1" })
        };

        Employer.findById.mockResolvedValue(null);
        connectDB.mockResolvedValue();

        const response = await createPost(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(404);
    });

    it("returns 400 when the maximum number of posts is reached", async () => {
        const mockEmployer = { _id: "651998e5e88d4b85c0ebb8de", postsMade: 5, maxPosts: 5, save: jest.fn() };
        const mockEvent = { 
            pathParameters: { creatorId: "651998e5e88d4b85c0ebb8de" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1", requirements: "requirements1", description: "description1" })
        };

        Employer.findById.mockResolvedValue(mockEmployer);
        connectDB.mockResolvedValue();

        const response = await createPost(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
    });

    it("returns 500 when an error occurs", async () => {
        const mockEvent = { 
            pathParameters: { creatorId: "651998e5e88d4b85c0ebb8de" },
            body: JSON.stringify({ category: "65103924261c27f48f71b3d2", position: "position1", requirements: "requirements1", description: "description1" })
        };

        Employer.findById.mockRejectedValue(new Error("Internal server error"));
        connectDB.mockResolvedValue();

        const response = await createPost(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(500);
    });
});
