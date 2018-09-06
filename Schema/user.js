const {Schema} = require('./config');

const UserSchema =  new Schema({
    username:String,
    password:String,
    avatar:{
        type:String,
        default:'/avatar/default.jpg'
    },
    role:{
        default:1,
        type:String
    },
    articleNum:Number,
    commentNum:Number
},{versionKey: false})
module.exports = UserSchema;