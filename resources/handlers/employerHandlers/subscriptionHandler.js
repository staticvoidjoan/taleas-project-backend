const stripe = require("stripe")("sk_test_51Ns4rKKz6QEa5lRsEQCTAql7fzfv7GIjGJPrsRiDbSNYCTgjFGs8eEnvahiffdeyCBtN1R788mDqgaspRPQM2cOM000OL4L9WF");

let customers = {};

module.exports.customers = customers;


module.exports.subscriptionHandler = async (event) => {
    console.log("Lambda function invoked");
    const stripeEvent = JSON.parse(event.body);
    console.log("Event body", event.body);

    if (stripeEvent.type === 'customer.created') {
        //will extract the customer id from the strpe event
        const customerId = stripeEvent.data.object.id;
        console.log("Customer id", customerId);

        //will be used to get from stripe the user details from the provided id
        const customer = await stripe.customers.retrieve(customerId);
        console.log(customer)

        customers[customer.email] = { id: customerId, balance: customer.balance };
        console.log("Customer info: ", customers);

        return {
            statusCode: 200,
            body: JSON.stringify({ customer_id: customerId, customer: customer }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Stripe webhook received' }),
    };
};

