
const Responses = require("../apiResponses");
const Post = require("../../models/postModel");
const {connectDB} = require("../../config/dbConfig");


module.exports.unmatchEmployee = async (event) => {

    try {

        await connectDB();

        const employeerId  = event.queryStringParameters.employeerId;
        const employeeId = event.queryStringParameters.employeeId;

        //find many posts that have the employeeId in the recLikes array and creator id as the employerId

        const posts = await Post.find({ creatorId: employeerId, recLikes: employeeId });
        if(!posts) {
            return Responses._400({message: "No posts found"});
        }

        console.log(posts);

        //remove the employeeId from the recLikes array
        const updatedPosts = posts.map((post) => ({
            ...post,
            recLikes: post.recLikes.filter((id) => id !== employeeId),
          }));

        console.log(updatedPosts);


          

        return Responses._200({
            status: "success",
            message: "Employee unmatched successfully",
        });

        

    }catch(error) {
        console.error("Something went wrong", error);
        return Responses._500({
            status: "error",
            message: "Something went wrong",
        });
    }
}