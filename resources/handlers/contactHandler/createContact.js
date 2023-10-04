import Contact from "../../models/contactModel";
import { connectDB } from "../../config/dbConfig";
import Responses from "../apiResponses";

module.exports.createContact = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const {name, lastname, email, message} = JSON.parse(event.body)
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;

    if(!name){
        console.log('Name is required');
        return Responses._400({status: 'error', message: 'Name is required'})
    }

    if(!textRegex.test(name)){
        console.log('Name is not valid');
        return Responses._400({status: 'error', message: 'Name is not valid'})
    }

    if(!lastname){
        console.log('Lastname is required');
        return Responses._400({status: 'error', message: 'Lastname is required'})
    }

    if(!textRegex.test(lastname)){
        console.log('Lastname is not valid');
        return Responses._400({status: 'error', message: 'Lastname is not valid'})
    }

    if(!email){
        console.log('Email is required');
        return Responses._400({status: 'error', message: 'Email is required'})
    }

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      console.log("Email is not valid");
      return Responses._404({
        status: "error",
        message: "Email is not valid",
      });
    }
    
    if(!message){
        console.log('Message is required')
        return Responses._400({status: "error", message: "Message is required"})
    }

    if(!textRegex.test(message)){
        console.log('Message is not valid')
        return Responses._400({status: "error", message: "Message is not valid"})
    }

    const contact = new Contact({
        name,
        lastname,
        email,
        message
    })
    const newContact = await contact.save()
    console.log(newContact);

    return Responses._201({status:"success", newContact})
    
  } catch (error) {
    console.log("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while creating contact form",
    });
  }
};
