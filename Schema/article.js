const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const UserSchema =  new Schema({
    title:String,
    tips:String,
    content:String,
    author:{
        type:ObjectId,
        ref:"users"
    }, //管理users 的表
    commentNum:Number
},{versionKey: false,timestamps:{
    createdAt:"created"
    }})
module.exports = UserSchema;