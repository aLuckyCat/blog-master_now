const Koa = require('koa');
const router = require('./routers/router');
const static = require('koa-static');
const views = require('koa-views');
const body = require('koa-body');
const session = require('koa-session')
// const logger = require('koa-logger');
const {join} = require('path');
//生成Koa实例
const app = new Koa();
app.keys = ['jxt']
const CONFIG = {
    key: "Sid",
    maxAge:36e5,
    overwrite :true,
    httpOnly:true,
    signed:true,
    rolling:true
}
//配置 session
app.use(session(CONFIG,app))

//注册日志文件
// app.ues(logger())
//配置koa-body
app.use(body())
//配置静态资源目录
app.use(static(join(__dirname,"public")));
//配置模板文件
app.use(views(join(__dirname,"views"),{
    extension:"pug"
}))

//注册路由信息
app.use(router.routes())
    .use(router.allowedMethods())
app.listen(3000,()=>{
    console.log("项目启动成功，监听在3000端口")
})

//创建管理员用户 如果管理员用户已经存在择返回
{
    //管理员账号 admin admin
    const {db} = require('./Schema/config');
    const UserSchema = require('./Schema/user');
    const encrypt = require('./util/encrypt')
    const User = db.model('users',UserSchema);
    User.find({username:"admin"})
        .then(data=>{
            if(data.length === 0){
                //没有创建
                new User({
                    username:'admin',
                    password:encrypt('admin'),
                    role:666,
                    articleNum:0,
                    commentNum:0
                }).save()
                    .then(data=>{
                        console.log('管理员用户为:admin     密码为:admin')
                    })
                    .catch(err =>{
                        console.log('管理员检查失败')
                    })
            }else{
                console.log('管理员用户为:admin     密码为:admin')
            }
        })

}