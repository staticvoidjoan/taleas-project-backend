const mongoose = require('mongoose');

module.exports.connectDB = async () => {
try{
    mongoose.connect("mongodb+srv://selmalico9:Z6lzE3uHR8bEMFlN@cluster0.agj0ktd.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, 
    useUnifiedTopology: true,})
    console.log("Connected to database")
} catch (err) {
    console.log("Something went wrong when connecting to the database", err);
}
}