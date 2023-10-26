const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const User = require("../../models/userModel");
const Responses = require("../apiResponses");
const Experience = require('../../models/experienceModel');
const Employer = require('../../models/employerModel');
const Category = require('../../models/categoryModel');

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

    const blockedCompanyIds = user.blockedCompanies.map((company) => company._id);

    const allPosts = await Post.find({
      _id: { $nin: [...likedPostIds, ...dislikedPostIds] },
      creatorId: { $nin: blockedCompanyIds },
    }).populate("likedBy")
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

    return Responses._200(sortedPosts);
  } catch (error) {
    console.error(error);
    return Responses._500({ message: "Internal server error" });
  }
};
