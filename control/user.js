const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')
const encrypt = require('../util/encrypt')

//这个是用户注册的中间件
exports.reg = async ctx=>{
    //用户注册是post发送过来的信息
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    //假设格式符合要求
    //去数据库 user 中查询当前发送过来的username是否存在
    await new Promise((resolve,reject)=>{
        //去users数据库内查询
        User.find({username},(err,data)=>{
            if(err) return reject(err);
            if(data.length!==0){
                //用户名存在
                return resolve('')
            }
            //用户名不存在 需要存到数据库内
            const _user =  new User({
                username,
                password:encrypt(password),
                commentNum:0,
                commentNum:0
            })
            _user.save((err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }).then(async data =>{
        if(data){
            //用户注册成功
           await ctx.render('isOk',{
                status:'注册成功!'
            })
        }else{
            //用户名已经存在
           await ctx.render('isOk',{
                status:'用户名已经存在!'
            })
        }
    })
        .catch(async err=>{
            await ctx.render('isOK',{
                status:"注册失败,请重试 ！"
            })
        })
}


//用户登录
exports.login = async ctx =>{
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    await new Promise( (resolve,reject)=>{
        User.find({username},(err,data)=>{
            if(err){
                return reject(err);
            }
            if(data.length===0) return reject("用户名不存在");
            //用户名存在 比对密码
            if(data[0].password === encrypt(password)){
                return resolve(data)
            }
            resolve('')
        })
    }).then(async data =>{
    if(!data){
        return ctx.render('isOk',{
            status:"密码不正确,登录失败"
        })
    }

    //在他的cookie中 设置username password 权限等
        ctx.cookies.set("username",username,{
            domain:"localhost",
            path:'/',
            maxAge:36e5,
            httpOnly:true, //true 不让客户端访问
            overwrite:false

        })
        //用户在数据库内的_id
        ctx.cookies.set("uid",data[0]._id,{
            domain:"localhost",
            path:'/',
            maxAge:36e5,
            httpOnly:true, //true 不让客户端访问
            overwrite:false

        })
        // ctx.session =null; 强制过期
        ctx.session = {
            username,
            uid:data[0]._id,
            avatar:data[0].avatar,
            role:data[0].role
        }
        await ctx.render("isOk",{
            status:"登录成功!"
        })
    }).catch(async err=>{
        if(err==="用户名不存在"){
            await ctx.render('isOk',{
                status:"用户不存在"
            })
        }else{
            await ctx.render('isOk',{
                status:"登录失败"
            })
        }
        })
}

//确定用户状态 保持登录状态
exports.KeepLog = async (ctx,next)=>{
    if(ctx.session.isNew){
        if(ctx.cookies.get("username")){
            let uid = ctx.cookies.get('uid');
            await User.findById()
                .then(data=>data.avatar)
            ctx.session ={
                username:ctx.cookies.get("username"),
                uid,
                avatar
            }
        }
    }
    await next();
}

exports.logout = async ctx=>{
    console.log(111111111111111)
    ctx.session = null;
    ctx.cookies.set('username',null,{
        maxAge:0
    })
    ctx.cookies.set('uid',null,{
        maxAge:0
    })
    ctx.redirect("/");//重定向
}

//用户的头像上传

exports.upload = async ctx=>{
    const filename = ctx.req.file.filename;
let data = {};
   await User.update({_id:ctx.session.uid},{$set:{avatar:`/avatar/${filename}`}},(err,res)=>{
       if(err){
           data = {
               status:0,
               message:"上传失败"
           }
       }else{
           data = {
               status:1,
               message:"上传成功"
           }
       }
       ctx.body = data;
   })

}