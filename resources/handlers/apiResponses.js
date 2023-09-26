const Responses = {
    _200(data = {}) {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
            },
            statusCode: 200,
            body: JSON.stringify(data),
        };
    },
    _404(data = {}) {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
        },
        statusCode: 404,
        body: JSON.stringify(data),
        };
    },
    _500(data = {}) {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
            },
            statusCode: 500,
            body: JSON.stringify(data),
        };
    },
    _400(data = {}) {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
            },
            statusCode: 400,
            body: JSON.stringify(data),
        };
    },
    _403(data = {}) {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
            },
            statusCode: 403,
            body: JSON.stringify(data),
        };
    
    }
};
module.exports = Responses;