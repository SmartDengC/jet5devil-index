---
title: Ubuntu 无图形化服务器配置 Mihomo
createTime: 2026/09/06 17:31:15
permalink: /article/xbpnj1n8/
---
# Ubuntu 无图形化服务器配置 Mihomo，并为 Freqtrade 配置代理

本文记录在无图形化 Ubuntu 服务器上安装 Mihomo（Clash Meta 内核）、导入订阅、排查网络问题，并让 Docker 中的 Freqtrade 通过 Mihomo 访问 Binance 的完整过程。

## 1. 问题背景

Freqtrade 启动时出现：

```text
ccxt.base.errors.RequestTimeout:
binance GET https://api.binance.com/api/v3/exchangeInfo
Could not load markets, therefore cannot start
```

这表示 Freqtrade 无法访问 Binance 公共市场接口。该问题通常不是策略、API Key 或 SQLite 数据库导致的，而是服务器到 Binance 的网络连接超时。

在中国大陆云服务器上，直连 Binance API 可能受到网络路由、出口网络或区域限制影响，因此需要通过可用的代理节点访问。

## 2. 确认服务器架构

```bash
dpkg --print-architecture
```

本文服务器返回：

```text
amd64
```

因此下载 `linux-amd64-compatible` 版本。`compatible` 版本兼容性较好，适合不确定 CPU 指令集的服务器。

## 3. 安装 Mihomo

安装依赖：

```bash
sudo apt update
sudo apt install -y curl gzip ca-certificates
```

下载并安装 Mihomo：

```bash
MIHOMO_VERSION=v1.19.28

curl -fL \
  "https://github.com/MetaCubeX/mihomo/releases/download/${MIHOMO_VERSION}/mihomo-linux-amd64-compatible-${MIHOMO_VERSION}.gz" \
  -o /tmp/mihomo.gz

gzip -dc /tmp/mihomo.gz | sudo tee /usr/local/bin/mihomo >/dev/null
sudo chmod +x /usr/local/bin/mihomo

mihomo -v
```

版本号应根据 [Mihomo 官方 Releases](https://github.com/MetaCubeX/mihomo/releases) 中的实际版本调整。

如果服务器无法访问 GitHub，可以在本地电脑下载文件，再上传到服务器：

```bash
scp mihomo-linux-amd64-compatible-v1.19.28.gz \
  ubuntu@服务器公网IP:/tmp/
```

然后在服务器上继续执行：

```bash
gzip -dc /tmp/mihomo.gz | sudo tee /usr/local/bin/mihomo >/dev/null
sudo chmod +x /usr/local/bin/mihomo
```

## 4. 创建运行用户和配置目录

```bash
sudo useradd --system --no-create-home \
  --shell /usr/sbin/nologin mihomo 2>/dev/null || true

sudo mkdir -p /etc/mihomo
sudo chown -R mihomo:mihomo /etc/mihomo
```

## 5. 下载和识别订阅文件

### 5.1 使用原始订阅 URL

命令中必须使用原始 URL：

```bash
sudo curl -L 'https://订阅服务商提供的原始链接' \
  -o /etc/mihomo/config.yaml
```

不能把 Markdown 链接格式直接复制到 Shell：

```text
[https://example.com/sub/xxx](https://example.com/sub/xxx)
```

### 5.2 订阅请求返回 403

如果文件内容是：

```text
订阅请求已被系统限制（403）
原因：订阅来源 ASN 命中黑名单
```

说明是订阅服务商拒绝了当前腾讯云服务器的公网 IP/ASN 请求，不是 Mihomo 配置错误。

可采取以下方式：

1. 在允许访问的本地网络下载订阅，再通过 `scp` 上传到服务器。
2. 联系订阅服务商，将服务器公网 IP 加入白名单。
3. 在服务商后台重新生成订阅链接，并确认允许 Clash/Mihomo 客户端访问。

不要把 403 错误文本直接作为 Mihomo 配置启动。

### 5.3 订阅文件是 Base64，而不是 YAML

如果执行：

```bash
head -n 10 /etc/mihomo/config.yaml
```

看到类似以下内容：

```text
dmxlc3M6Ly...
```

这通常是 Base64 编码的 `vless://`、`vmess://` 等节点列表，不是完整的 Mihomo 主配置。

将它保存为代理集合文件：

```bash
sudo cp /etc/mihomo/config.yaml /etc/mihomo/proxy_provider.txt
```

然后用下面的内容重新生成真正的 `/etc/mihomo/config.yaml`：

```yaml
mixed-port: 7890
allow-lan: true
bind-address: "*"
mode: rule
log-level: info
ipv6: false

proxy-providers:
  subscription:
    type: file
    path: ./proxy_provider.txt
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300

proxy-groups:
  - name: PROXY
    type: select
    use:
      - subscription
    proxies:
      - DIRECT

rules:
  - MATCH,PROXY
```

设置权限：

```bash
sudo chown -R mihomo:mihomo /etc/mihomo
```

Mihomo 的 `file` 类型 proxy-provider 支持 Base64 节点 URI 文件。详见 [Mihomo proxy-providers 文档](https://wiki.metacubex.one/en/config/proxy-providers/content/)。

## 6. 创建 systemd 服务

创建服务文件：

```bash
sudo tee /etc/systemd/system/mihomo.service >/dev/null <<'EOF'
[Unit]
Description=Mihomo Proxy Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mihomo
Group=mihomo
ExecStart=/usr/local/bin/mihomo -d /etc/mihomo
Restart=on-failure
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

测试、启动并设置开机启动：

```bash
sudo -u mihomo mihomo -t -d /etc/mihomo
sudo systemctl daemon-reload
sudo systemctl enable --now mihomo
sudo systemctl status mihomo --no-pager
```

查看日志：

```bash
sudo journalctl -u mihomo -f
```

确认代理端口：

```bash
sudo ss -lntp | grep 7890
```

正常日志类似：

```text
Mixed(http+socks) proxy listening at: [::]:7890
```

## 7. 测试 Mihomo 代理

必须使用普通 URL，不要带 Markdown 的 `[ ]( )`：

```bash
curl --proxy http://127.0.0.1:7890 \
  --connect-timeout 15 \
  https://www.gstatic.com/generate_204 \
  -o /dev/null -w '%{http_code}\n'
```

返回 `204` 表示 Mihomo 代理和当前节点基本可用。

测试 Binance：

```bash
curl --proxy http://127.0.0.1:7890 \
  --connect-timeout 15 \
  https://api.binance.com/api/v3/ping \
  -o /dev/null -w '%{http_code}\n'
```

成功时通常返回：

```text
200
```

或者直接查看响应：

```bash
curl --proxy http://127.0.0.1:7890 \
  --connect-timeout 15 \
  https://api.binance.com/api/v3/ping
```

预期结果：

```json
{}
```

## 8. 处理代理节点连接超时

如果 Mihomo 日志显示：

```text
[TCP] dial PROXY ... --> api.binance.com:443 error: dial tcp ...: i/o timeout
```

同时 Google 返回 `204`，说明：

- Mihomo 服务正常；
- 本地代理端口正常；
- 当前选中的代理节点无法访问 Binance。

此时不应先修改 Freqtrade 的超时时间，应切换其他代理节点，或更换订阅线路。

如果所有节点都无法访问 Binance，可能是节点出口 IP 被 Binance 限制，或者订阅服务商不支持 Binance 线路。

## 9. 可选：启用 Mihomo 控制器

如果需要通过 API 查看或切换节点，在 `/etc/mihomo/config.yaml` 顶层加入：

```yaml
external-controller: 127.0.0.1:9090
```

重启服务：

```bash
sudo -u mihomo mihomo -t -d /etc/mihomo
sudo systemctl restart mihomo
```

确认端口：

```bash
sudo ss -lntp | grep -E '7890|9090'
```

测试控制器：

```bash
curl -sS http://127.0.0.1:9090/version
```

查看代理列表：

```bash
curl -sS http://127.0.0.1:9090/proxies | jq '.proxies | keys'
```

查看 `PROXY` 组：

```bash
curl -sS http://127.0.0.1:9090/proxies/PROXY | jq
```

切换节点：

```bash
curl -sS -X PUT \
  http://127.0.0.1:9090/proxies/PROXY \
  -H 'Content-Type: application/json' \
  -d '{"name":"节点名称"}'
```

将 `节点名称` 替换为实际节点名。

`9090` 只绑定到 `127.0.0.1`，不要开放到腾讯云公网安全组。

## 10. 修改 Freqtrade Docker Compose

当前项目的 `docker-compose.yml` 需要在 `freqtrade` 服务下增加：

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

完整结构示例：

```yaml
services:
  freqtrade:
    image: freqtradeorg/freqtrade:stable
    restart: unless-stopped
    container_name: freqtrade

    extra_hosts:
      - "host.docker.internal:host-gateway"

    volumes:
      - "./user_data:/freqtrade/user_data"

    ports:
      - "127.0.0.1:8080:8080"

    command: >
      trade
      --logfile /freqtrade/user_data/logs/freqtrade.log
      --db-url sqlite:////freqtrade/user_data/tradesv3.sqlite
      --config /freqtrade/user_data/config.json
      --strategy SampleStrategy
```

`host.docker.internal` 通过 `host-gateway` 指向 Docker 宿主机，因此容器可以访问宿主机上的 Mihomo `7890` 端口。

不要在容器中使用 `127.0.0.1:7890`，因为那会指向 Freqtrade 容器自身，而不是 Ubuntu 宿主机。

## 11. 修改 Freqtrade 配置

在 `user_data/config.json` 的 `exchange` 配置中加入 CCXT 代理：

```json
"exchange": {
    "name": "binance",
    "api_key": "",
    "secret": "",
    "ccxt_config": {
        "httpsProxy": "http://host.docker.internal:7890",
        "wsProxy": "http://host.docker.internal:7890"
    },
    "ccxt_async_config": {
        "httpsProxy": "http://host.docker.internal:7890",
        "wsProxy": "http://host.docker.internal:7890"
    }
}
```

其中：

- `httpsProxy` 用于 Binance HTTPS REST API 请求；
- `wsProxy` 用于 WebSocket 连接；
- Freqtrade 使用异步 CCXT，因此同时配置 `ccxt_config` 和 `ccxt_async_config` 更稳妥。

Freqtrade 官方代理配置见：[Proxy exchange requests](https://docs.freqtrade.io/en/2026.3/configuration/#proxy-exchange-requests)。

## 12. 重启和验证 Freqtrade

在项目目录执行：

```bash
cd ~/github/ft_userdata
docker compose config
docker compose up -d --force-recreate
docker logs -f freqtrade
```

也可以验证容器是否能通过宿主机 Mihomo 访问 Binance：

```bash
docker exec freqtrade python -c \
'import urllib.request; p=urllib.request.ProxyHandler({"http":"http://host.docker.internal:7890","https":"http://host.docker.internal:7890"}); print(urllib.request.build_opener(p).open("https://api.binance.com/api/v3/ping", timeout=15).status)'
```

返回：

```text
200
```

表示 Docker 容器到宿主机 Mihomo，再到 Binance 的网络链路正常。

## 13. 常见问题速查

| 现象 | 原因 | 处理方式 |
| --- | --- | --- |
| `Could not load markets` | Freqtrade 无法访问 Binance 市场接口 | 检查宿主机和容器的代理链路 |
| 订阅返回 `403 ASN blacklist` | 订阅服务商拒绝云服务器 IP/ASN | 本地下载后上传，或联系服务商加白 |
| `config.yaml` 以 `dmxlc3M6...` 开头 | 文件是 Base64 节点列表，不是主 YAML | 保存为 provider 文件，用 `proxy-providers` 引入 |
| `7890` 没有监听 | Mihomo 服务未启动或配置错误 | 查看 `systemctl status` 和 `journalctl` |
| Google `204`，Binance 超时 | 当前代理节点无法访问 Binance | 切换节点或更换线路 |
| `9090 connection refused` | 未配置 `external-controller` | 在主配置中加入控制器配置并重启 |
| Docker 中连接 `127.0.0.1:7890` 失败 | 容器内的 loopback 不是宿主机 | 使用 `host.docker.internal:7890` |

## 14. 安全注意事项

- 不要把订阅链接提交到 Git 或发到公开聊天中；订阅 URL 通常包含节点凭据。
- 不要开放腾讯云安全组中的 `7890` 和 `9090` 端口。
- 不要在文档、日志或截图中暴露 Binance API Key、Secret、Telegram Token、JWT Secret、WebSocket Token。
- 如果这些信息已经泄露，应在对应服务后台重新生成。
- Freqtrade 从 dry-run 切换到实盘前，应使用新的数据库，并再次确认 API Key 权限和代理线路。
