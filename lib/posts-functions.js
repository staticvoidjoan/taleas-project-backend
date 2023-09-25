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
            "../resources/handlers/postHandlers/getAllPosts.js",
            "getAllPosts"
        );
        
        //not show posts user has already interacted with
        const getAllPostsForAUser = createNodejsFunction(
            this, 
            "getPostsForAUser",
            "../resources/handlers/postHandlers/getAllPostsForAUser.js",
            "getAllPostsForAUser"
        );

        const getPostById = createNodejsFunction(
            this, 
            "getPostById",
            "../resources/handlers/postHandlers/getPostById.js",
            "getPostById"
        );

        const getPostsByCategory = createNodejsFunction(
            this, 
            "getPostsByCategory",
            "../resources/handlers/postHandlers/getPostsByCategory.js",
            "getPostsByCategory"
        );

        const getPostsByCreatorId = createNodejsFunction(
            this, 
            "getPostsByCreatorId",
            "../resources/handlers/postHandlers/getPostsByCreatorId.js",
            "getPostsByCreatorId"
        );

        const updatePost = createNodejsFunction(
            this, 
            "updatePost",
            "../resources/handlers/postHandlers/updatePost.js",
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

        const byCategory = new apigateway.Resource(this, "byCategory", {
            parent: posts, 
            pathPart: "category", 
        });

        ///caategory/{category}
        const postByCategoryid = new apigateway.Resource(this, "PostByCategoryId", {
            parent: byCategory, 
            pathPart: "{category}",
            requestParameters: {
                "method.request.querystring.myQueryParam": true,
            },
        })

        const byCreator = new apigateway.Resource(this, "byCreatorId", {
            parent: posts,
            pathPart: "creator",
        });

        //creator/{creatorId} 
        const postByCreatorId = new apigateway.Resource(this, "PostByCreatorId", {
            parent: byCreator,
            pathPart: "{creatorId}"
        });

        const forAUser = new apigateway.Resource(this, "forAUser", {
            parent: posts, 
            pathPart: "user",
        });
        //user/{userId}
        const postForAUser = new apigateway.Resource(this, "PostForAUser", {
            parent: forAUser,
            pathPart: "{userId}"
        });
        //methods
        posts.addMethod("GET", new apigateway.LambdaIntegration(getAllPosts));
        post.addMethod("GET", new apigateway.LambdaIntegration(getPostById));
        post.addMethod("PUT", new apigateway.LambdaIntegration(updatePost));
        post.addMethod("DELETE", new apigateway.LambdaIntegration(deletePost));
        postByCategoryid.addMethod("GET", new apigateway.LambdaIntegration(getPostsByCategory));
        postByCreatorId.addMethod("GET", new apigateway.LambdaIntegration(getPostsByCreatorId));
        postByCreatorId.addMethod("POST", new apigateway.LambdaIntegration(createPost));
        postForAUser.addMethod("GET", new apigateway.LambdaIntegration(getAllPostsForAUser));
    }
}

module.exports = { PostFunctions }