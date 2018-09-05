const {Schema} = require('./config');

const UserSchema =  new Schema({
    title:String,
    tips:String,
    content:String,
    author:String
},{versionKey: false,timestamps:{
    createdAt:"created"
    }})
module.exports = UserSchema;