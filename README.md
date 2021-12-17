
**国内访问学者系统前端**

前端基于`vue-element-admin`修改，初次写前端，很拉跨。

主要由五个页面组成：

`src/views/login`：登录页面

`src/admin-manage`：管理员管理页面

`src/record-manage`：记录管理页面

`src/vistior`：游客访问

`src/notice`： 通知页面

可以修改`router.index`动态添加需要的页面

`api`中`user`、`record`、`notice`是自定义的，其他是原项目自带的，没有用到

后端没有实现`getinfo`来动态路由，只是模拟返回

后端代码：`coding`私有仓库 email: 911190218@qq.com

**个人项目部署**

1.`npm run build:prod` 项目打包 生成`dist`目录

2.通过`webStorm`的`docker`插件部署在`nginx`,配置见`Dockerfile`和`default.conf`

3.`docker`的`9527`端口映射服务器的`80`端口

**2021.12.17 甲方服务器部署**

由于繁杂的安全策略，采用`jar`+`nginx`反向代理部署。

`npm run build:prod`：生成`dist`,放在服务器`/var/www/html/`

`nginx`配置文件：`etc/nginx/conf.d/default.conf`  `etc/nginx/nginx.conf`



```nginx
  #default.conf

  1 server {
  2 #    listen 80 default_server;
  3 #    listen [::]:80 default_server;
  4     listen      80;
  5     server_name     localhost;
  6     default_type 'text/html';
  7     #charset utf-8;
  8     location / {
  9         root      /var/www/html/dist/;
 10         index     index.html;
 11     }
 12     location /api/ {
 13         proxy_pass http://127.0.0.1:8575/;
 14         proxy_redirect     off;
 15         proxy_set_header   Host         $host;
 16         proxy_set_header   X-Proxied    true;
 17         proxy_set_header   X-Real-IP    $remote_addr;
 18         proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
 19         proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
 20         proxy_max_temp_file_size 0;
 21         proxy_connect_timeout      600s;
 22         proxy_send_timeout     600s;
 23         proxy_read_timeout     600s;
 24         proxy_buffer_size      20M;
 25         proxy_buffers          4 10M;
 26         proxy_busy_buffers_size    20M;
 27         proxy_temp_file_write_size 20M;
 28     }
 29     error_page   500 502 503 504  /50x.html;
 30 }

```

