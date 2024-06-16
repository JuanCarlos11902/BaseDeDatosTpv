const mongoose = require('mongoose');
const dbUri = "mongodb+srv://jcperezromero02:01p0h7b19dCK3qT0@rinconloscuatrobasededa.lmgnbfz.mongodb.net/"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));