const {connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");


module.exports.createPost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectDB();
    try{
        const {creatorId} = event.pathParameters; 
        const {category, position , requirements, description} = JSON.parse(event.body);
        if(!category || !creatorId || !position || !requirements || !description ) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide all the required fields"
                }
            }
        }
        if(!mongoose.Types.ObjectId.isValid(creatorId)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid creator id"
                }
            }
        }
        if(!mongoose.Types.ObjectId.isValid(category)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid category id"
                }
            }
        }
        for (let requirement of requirements) {
            if(!requirement.test('/^[a-zA-Z]+$/')) {
                return {
                    statusCode: 400, 
                    headers : {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": true,
                    },
                    body : {
                        status: "error", 
                        error: "Please provide a valid requirement"
                    }
                }
            }
        }
        if(!description.test('/^[a-zA-Z]+$/')) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid requirement"
                }
            }
        }

        if(!position.test('/^[a-zA-Z]+$/')) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid requirement"
                }
            }
        }
        
        
        const newPost = new Post({
            category,
            creatorId,
            position,
            requirements,
            description
        });
        await newPost.save();
        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(newPost)
        }
    }catch(error) {
        console.log(error);
        return {
            statusCode: 500, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(error)
        }
    }
}