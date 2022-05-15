import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
    name: String,
    profession: String,
    requestId: String,
    place: String,
    email: String,
    description: String,
    experience: [],
    status: String,
    error: String
});

personSchema.methods.reducedJson = function () {
    const { name,
        profession,
        place,
        email,
        description, experience } = this;
    return {
        name,
        profession,
        place,
        email,
        description, experience
    };
};

export default mongoose.model('Person', personSchema);


