const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title:String,
    description:String,
    link:String,
    github:String,
    image: {
        url: {
            type:String,
            default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        public_id: String
    },
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
});

module.exports = mongoose.model('Project',projectSchema);