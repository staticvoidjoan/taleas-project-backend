const stripe = require("stripe")("sk_test_51Ns4rKKz6QEa5lRsEQCTAql7fzfv7GIjGJPrsRiDbSNYCTgjFGs8eEnvahiffdeyCBtN1R788mDqgaspRPQM2cOM000OL4L9WF");

module.exports.subscriptionHandler = async (event) => {
    console.log("Lambda function invoked");
    // Parse the Stripe webhook event
    const stripeEvent = JSON.parse(event.body);
    console.log("Event body", event.body);

    if (stripeEvent.type === 'customer.created') {
        // Extract the customer ID from the Stripe event
        const customerId = stripeEvent.data.object.id;
        console.log("Customer id", customerId);

        // Use the Stripe library to retrieve the customer details
        const customer = await stripe.customers.retrieve(customerId);
        console.log(customer)

        // Perform further actions with the customer data
        console.log(`Customer ID: ${customerId}`);

        // Return the customer ID in the response
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

