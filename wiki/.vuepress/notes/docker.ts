import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Docker",
  link: "/docker/",
  sidebar: [
    {
      text: "",
      items: [
        {
          text: "docker-info",
          collapsed: false,
          icon: "solar:tag-bold",
          items: [
            "docker-info/容器化：Docker入门知识点总结",
            "docker-info/Centos8离线安装Docker",
          ],
        },
      ],
    },
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      // collapsed: true,
      items: [
        {
          text: "docker-build", // 第二层text不能为空
          icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "docker-build/Docker：构建Bimg Docker容器",
            "docker-build/Docker：构建DB2容器",
            "docker-build/Docker：构建elm_model运行容器",
            "docker-build/Docker：构建Jenkins Docker容器",
            "docker-build/Docker：构建Mongo Docker容器",
            "docker-build/Docker：构建mysql5.7 Docker容器",
            "docker-build/Docker：构建Mysql8.0.41 Docker容器",
            "docker-build/Docker：构建PostgreSQL容器",
            "docker-build/Docker：构建Redis Docker容器",
            "docker-build/Docker：构建Jupyter Notebook容器",
            "docker-build/Docker：构建MinIO容器",
            "docker-build/Docker：构建Nginx容器",
          ],
        },
      ],
    },
    {
      text: "",
      items: [
        {
          text: "dockerfile-info",
          collapsed: false,
          icon: "solar:tag-bold",
          items: ["dockerfile-info/学习使用Dockerfile"],
        },
      ],
    },
  ],
});
