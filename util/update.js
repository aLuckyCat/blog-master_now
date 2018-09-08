const multer = require('koa-multer')
const {join} = require('path');
const storage = multer.diskStorage({
    //存储位置
    destination:join(__dirname,"../public/avatar"),
    filename(req,file,cd){
        const filename = file.originalname.split('.');
        cd(null,`${Date.now()}.${filename[filename.length-1]}`)
    }

})

module.exports = multer({storage})




