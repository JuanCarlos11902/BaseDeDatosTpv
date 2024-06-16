const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI || "mongodb+srv://jcperezromero02:01p0h7b19dCK3qT0@rinconloscuatrobasededa.lmgnbfz.mongodb.net/?retryWrites=true&w=majority&appName=RinconLosCuatroBaseDeDatos";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));