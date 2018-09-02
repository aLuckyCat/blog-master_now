const Koa = require('koa');
const router = require('./routers/router');
const static = require('koa-static');
const views = require('koa-views');
// const logger = require('koa-logger');
const {join} = require('path');
//生成Koa实例
const app = new Koa();
//注册日志文件
// app.ues(logger())
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