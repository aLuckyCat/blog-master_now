//链接数据库  导出 schema
const mongoose = require('mongoose');

const db =mongoose.createConnection('mongodb://localhost:27017/blogproject',{useNewurlParser:true});
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

db.on('error',()=>{
    console.log('数据库连接失败')
})
db.on('open',()=>{
    console.log('数据库链接成功')
})




module.exports = {
    db,
    Schema
}