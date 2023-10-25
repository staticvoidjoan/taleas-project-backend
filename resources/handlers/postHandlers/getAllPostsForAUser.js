const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
const Experience = require("../../models/experienceModel");
module.exports.getAllPostsForAUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  const { userId } = event.pathParameters;

  try {
    const userHistory = await History.findOne({ user: userId });
    console.log(userHistory);
    const likedPostIds = userHistory?.likedPosts || [];
    const dislikedPostIds = userHistory?.dislikedPosts || [];

    const user = await User.findById(userId).populate("experience").populate("blockedCompanies");
    console.log(user);
    const userJobPositions = user.experience.map((exp) => exp.position) || [];
    console.log(userJobPositions);
    const userSkills = user.generalSkills || [];
    console.log(userSkills);

    const jobPositionRegex = userJobPositions.map((position) =>
      new RegExp(position.split(/\s+/).map(escapeRegExp).join("|"), "i")
    );
    const skillRegex = userSkills.map((skill) =>
      new RegExp(skill.split(/\s+/).map(escapeRegExp).join("|"), "i")
    );

    function escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    const allPosts = await Post.find({
      _id: { $nin: [...likedPostIds, ...dislikedPostIds] },
      creatorId: {$nin: user.blockedCompanies},
    })
      .populate("likedBy")
      .populate("recLikes")
      .populate("category")
      .populate("creatorId");

    const postsWithScore = allPosts.map((post) => {
      const positionMatch = jobPositionRegex.reduce(
        (matchCount, regex) =>
          matchCount + (post.position.match(regex) ? 1 : 0),
        0
      );

      const skillMatch = skillRegex.reduce(
        (matchCount, regex) =>
          matchCount +
          (post.requirements.some((req) => req.match(regex)) ? 1 : 0),
        0
      );

      return { post, score: positionMatch + skillMatch };
    });

    postsWithScore.sort((a, b) => b.score - a.score);
    const sortedPosts = postsWithScore.map((entry) => entry.post);

    if (sortedPosts.length === 0) {
      return Responses._404({ message: "No posts found" });
    }

    // Return the sorted posts directly, without an extra object wrapper
    return Responses._200(sortedPosts);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return Responses._500({ message: "Internal server error" });
  }
};
