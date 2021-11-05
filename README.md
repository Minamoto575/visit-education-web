
**国内访问学者系统前端**

前端基于`vue-element-admin`修改

主要由四个页面组成：

`src/views/login`：登录页面

`src/admin-manage`：管理员管理页面

`src/record-manage`：记录管理页面

`src/vistior`：游客访问

可以修改`router.index`动态添加需要的页面

`api`中`user`和`record`是自定义的，其他是原项目自带的，没有用到

后端没有实现`getinfo`来动态路由，只是模拟返回

后端代码：https://github.com/Minamoto575/visit-education-web

**项目部署**

1.`npm run build:prod` 项目打包 生成`dist`目录

2.通过`webStorm`的`docker`插件部署在`nginx`,配置见`Dockerfile`和`default.conf`

3.`docker`的`9527`端口映射服务器的`80`端口
