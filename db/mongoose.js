const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI || "mongodb+srv://jcperezromero02:01p0h7b19dCK3qT0@cluster0.ppamsvx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI);

module.exports = mongoose;