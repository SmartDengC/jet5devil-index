---
title: Nginx一个端口代理多个静态网站
createTime: 2025/06/08 23:00:09
permalink: /nginx/04h6qg54/
---
```nginx
        server {
                listen 9271;
                server_name 8.137.124.148;

                location / {
                        root /home/dengcong/project/blog;
                        index index.html index.htm;
                }

                location /wiki {
                        alias /home/dengcong/project/blog/wiki/dist;
                        try_files $uri $uri/ /wiki/dist/index.html;
                        index index.html index.htm;
                }

                location /iron {
                        alias /home/dengcong/project/blog/iron/dist;
                        try_files $uri $uri/ /iron/dist/index.html;
                        index index.html index.htm;
                }
        }
```

