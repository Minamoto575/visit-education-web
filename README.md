国内访问学者系统基于`vue-element-admin`修改



主要由四个页面组成：

`src/views/login`：登录页面

`src/admin-manage`：管理员管理页面

`src/record-manage`：记录管理页面

`src/vistior`：游客访问



可以修改`router.index`动态添加需要的页面



`api`中`user`和`record`是自定义的，其他是原项目自带的，没有用到

后端没有实现`getinfo`来动态路由，只是模拟返回