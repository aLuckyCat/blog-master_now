const {db} = require('../Schema/config');
const UserSchema = require('../Schema/user');
const encrypt = require('../util/encrypt')
//通过db对象创建操作user数据库的模型的对象
const User = db.model('users',UserSchema)
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
                password:encrypt(password)
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
            if(err)return reject(err);
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
        await ctx.render("isOk",{
            status:"登录成功!"
        })
    }).catch(async err=>{
        if(err==="用户名不存在"){
            await ctx.render('isOk',{
                status:"用户不存在"
            })
        }
        await ctx.render('isOk',{
            status:"登录失败"
        })
        })
}