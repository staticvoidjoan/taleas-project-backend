const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");

function createNodejsFunction(scope, id, entry, handler) {
    return new NodejsFunction(scope, id, {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, entry),
      handler: handler,
    });
}

class PostFunctions extends Construct {
    constructor(scope, id, props) {
        super(scope, id, props);

        const createPost = createNodejsFunction(
            this, 
            "createPost", 
            "../resources/handlers/postHandlers/createPost.js", 
            "createPost"
        );
        const deletePost = createNodejsFunction(
            this, 
            "deletePost", 
            "../resources/handlers/postHandlers/deletePost.js",
            "deletePost"
        );
        const getAllPosts = createNodejsFunction(
            this, 
            "getAllPosts",
            "resources/handlers/postHandlers/getAllPosts.js",
            "getAllPosts"
        );
        
        //not show posts user has already interacted with
        const getAllPostsForAUser = createNodejsFunction(
            this, 
            "getAllPostsForAUser",
            "resources/handlers/postHandlers/getAllPostsForAUser.js",
            "getAllPostsForAUser"
        );

        const getPostById = createNodejsFunction(
            this, 
            "getPostById",
            "resources/handlers/postHandlers/getPostById.js",
            "getPostById"
        );

        const getPostsByCategory = createNodejsFunction(
            this, 
            "getPostsByCategory",
            "resources/handlers/postHandlers/getPostsByCategory.js",
            "getPostsByCategory"
        );

        const getPostsByCreatorId = createNodejsFunction(
            this, 
            "getPostsByCreatorId",
            "resources/handlers/postHandlers/getPostsByCreatorId.js",
            "getPostsByCreatorId"
        );

        const updatePost = createNodejsFunction(
            this, 
            "updatePost",
            "resources/handlers/postHandlers/updatePost.js",
            "updatePost"
        );
        //resources
        const posts = new apigateway.Resource(this, "PostResource", {
            parent: props.api.root, 
            pathPart: "posts"
        });

        const post = new apigateway.Resource(this, "PostById", {
            parent: posts, 
            pathPart: "{id}", 
        });

        const postByCategory = new apigateway.Resource(this, "PostByCategory", {
            parent: posts, 
            pathPart: "{category}", 
        });

        const postByCreatorId = new apigateway.Resource(this, "PostByCreatorId", {
            parent: posts,
            pathPart: "{creatorId}",
        });

        const postForAUser = new apigateway.Resource(this, "PostForAUser", {
            parent: posts, 
            pathPart: "{userId}",
        });
        //methods
        posts.addMethod("POST", new apigateway.LambdaIntegration(createPost));
        posts.addMethod("GET", new apigateway.LambdaIntegration(getAllPosts));
        
        post.addMethod("GET", new apigateway.LambdaIntegration(getPostById));
        post.addMethod("PUT", new apigateway.LambdaIntegration(updatePost));
        post.addMethod("DELETE", new apigateway.LambdaIntegration(deletePost));
        
        postByCategory.addMethod("GET", new apigateway.LambdaIntegration(getPostsByCategory));
        postByCreatorId.addMethod("GET", new apigateway.LambdaIntegration(getPostsByCreatorId));
        postForAUser.addMethod("GET", new apigateway.LambdaIntegration(getAllPostsForAUser));
    }
}

module.exports = { PostFunctions }