import mongoose from 'mongoose';
const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });