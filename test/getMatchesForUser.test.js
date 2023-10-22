const { getMatchesForUser } = require("../resources/handlers/GetMatchesForUser/getMatchesForUser");
const Post = require("../resources/models/postModel");
const {connectDB} = require("../resources/config/dbConfig");

jest.mock("../resources/config/dbConfig");
jest.mock("../resources/models/postModel");

describe("getMatchesForUser", () => {
    it("returns posts when found", async () => {
        const mockPosts = [
            { _id: "6519991a8d591acc205faa9d", creatorId: "651998e5e88d4b85c0ebb8de", recLikes: "651999b10c9bcd1c0131ccb2", likedBy: "651999b10c9bcd1c0131ccb2" },
        ];        
        const mockEvent = { pathParameters: { id: "6519991a8d591acc205faa9d" } };

        Post.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockPosts),
        });
        connectDB.mockResolvedValue();

        const response = await getMatchesForUser(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
    });

    it("returns 404 when no posts are found", async () => {
        const mockEvent = { pathParameters: { id: "6519991a8d591acc205faa9d" } };

        Post.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        connectDB.mockResolvedValue();

        const response = await getMatchesForUser(mockEvent);

        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(404);
    });
});
