---
title: Docker日志清理：从常规到强制
createTime: 2026/01/20 15:16:08
permalink: /docker/sym23w5y/
---
[Docker日志清理完全指南：从常规清理到紧急强制清理](https://www.freebird2913.tech/posts/docker-log-cleanup-guide/)

## 检查Docker日志占用情况

###  查看所有容器日志大小

```shell
# 查看所有容器日志文件大小
sudo du -sh /var/lib/docker/containers/*/*-json.log

# 按大小排序显示
sudo du -h /var/lib/docker/containers/*/*-json.log | sort -rh | head -20
```

### 查看特定容器日志大小

```shell
# 通过容器名称查看
docker inspect --format='{{.LogPath}}' <容器名称> | xargs ls -lh

# 或者直接查看
docker inspect <容器名称> | grep LogPath
```

### 查看Docker总体磁盘占用

```shell
docker system df
docker system df -v  # 详细信息
```

## 常规日志清理

### 清空特定容器日志（推荐）

这是最安全的方法，不会影响容器的运行：

```shell
# 清空单个容器的日志
sudo truncate -s 0 $(docker inspect --format='{{.LogPath}}' <容器名称>)

# 或者使用cat命令
sudo sh -c "cat /dev/null > $(docker inspect --format='{{.LogPath}}' <容器名称>)"
```

