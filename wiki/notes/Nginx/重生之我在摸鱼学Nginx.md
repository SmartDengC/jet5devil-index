---
title: 重生之我在摸鱼学Nginx
createTime: 2025/05/23 21:43:31
permalink: /nginx/lkksx340/
---

基本信息说明

自己的博客，例如wiki、iron是部署在8.137上面的， 因为域名是绑定的8.137的服务器。



https://hahadeng.cn/1920x1080



### nginx.conf

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;

        server {
                listen 80;
                # server_name distinct for localhost and ip
                server_name hahadeng.cn;
                # 将请求转成https
                rewrite ^(.*)$ https://$host$1 permanent;
        }
         server {
                listen 443 ssl;
                server_name 8.137.124.148;
                ssl_certificate  /home/dengcong/ssl/hahadeng.cn.pem;
                ssl_certificate_key /home/dengcong/ssl/hahadeng.cn.key;

                location / {
                        # root /home/dengcong/project/blog/wiki/dist;
                        root /home/dengcong/project/blog/wiki/wiki/.vuepress/dist;
                        index index.html index.htm;
                }
                location /1920x1080 {
                        proxy_pass http://132.232.242.223:8001/1920x1080;
                }
                location /today_1920x1080 {
                        proxy_pass http://132.232.242.223:9127/today?w=1920&h=1080&uhd=False&mkt=zh-CN;
                }
                location /random_1920x1080 {
                        proxy_pass http://132.232.242.223:9127/random?w=1920&h=1080&uhd=False&mkt=zh-CN;
                }
        }

        server {
               listen       443 ssl;
               server_name  wiki.hahadeng.cn;

               ssl_certificate  /home/dengcong/ssl/wiki.hahadeng.cn.pem;
               ssl_certificate_key /home/dengcong/ssl/wiki.hahadeng.cn.key;

               location / {
                        root /home/dengcong/project/blog/wiki/wiki/.vuepress/dist;
                        index index.html index.htm;
               }
               location /wiki/ {
                        root /home/dengcong/project/blog/wiki/dist;
                        index index.html index.htm;
               }
               location /iron {
                        root /home/dengcong/project/blog/iron/dist;
                        index index.html index.htm;
               }
            }

        server {
                listen 9271;
                # server_name 8.137.124.148;
                server_name iron.hahadeng.cn;
                location / {
                        root /home/dengcong/project/blog/iron/dist;
                        index index.html index.htm;
                }
                location /editor {
                        root /home/dengcong/project/onlineEditor/dist;
                        index index.html index.htm;
                }

        }
        server {
                listen 8090;
                server_name 8.137.124.148;
                #配置跨域
                add_header Access-Control-Allow-Origin *;
                add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
                add_header Access-Control-Allow-Headers Content-Type,Authorization;
 
                location / {

                        #代理的本地文件夹
                        root /home/dengcong;
                        #开启目录浏览功能； 
                        autoindex on;  
                        #关闭详细文件大小统计，让文件大小显示MB，GB单位，默认为b；
                        autoindex_exact_size off;  
                        #开启以服务器本地时区显示文件修改日期！ 
                        autoindex_localtime on;
                        auth_basic "Auth access Blog Input your Passwd!";
                        auth_basic_user_file /etc/nginx/.htpasswd;
                }
        }

        # include /etc/nginx/conf.d/*.conf;
        include server/*;

}


#mail {
#       # See sample authentication script at:
#       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
# 
#       # auth_http localhost/auth.php;
#       # pop3_capabilities "TOP" "USER";
#       # imap_capabilities "IMAP4rev1" "UIDPLUS";
# 
#       server {
#               listen     localhost:110;
#               protocol   pop3;
#               proxy      on;
#       }
# 
#       server {
#               listen     localhost:143;
#               protocol   imap;
#               proxy      on;
#       }
#}
```


