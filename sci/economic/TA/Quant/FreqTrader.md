---
title: FreqTrader
createTime: 2026/09/03 13:47:10
permalink: /economic/veftxco0/
---



今天接触到一个关于加密货币的量化项目，试着看用用，主要可以通过 MCP搭配 codex 来使用。

项目地址：

- [freqtrader](https://github.com/freqtrade/freqtrade)

- [freqtrader-mcp](https://github.com/kukapay/freqtrade-mcp)

项目文档：

- [freqtrader doc](https://www.freqtrade.io/en/stable/docker_quickstart/)

视频地址：

- [Video Url](https://www.bilibili.com/video/BV1RhNA6jELx/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=35e7dde81183ac464990a0a0ab794bce)



问 Codex：

我已经把[https://github.com/kukapay/freqtrade-mcp](https://github.com/kukapay/freqtrade-mcp) 的代码已经拉取下来了，想在 codex 里面使用 freqtrader-mcp 连接本地启动的 freqtrader 服务，该如何安装 freqtrader-mcp？有可连接的 freqtrade 进程，使用过 docker 运行的[http://localhost:8080/](http://localhost:8080/)

使用：

查询当前 Freqtrade 的 bot 状态、余额和白名单。



检查安装成功：

freqtrade --version

freqtrade --help

python -c "import freqtrade; print('freqtrade 安装成功')"



[Strategy001.py](https://raw.githubusercontent.com/freqtrade/freqtrade-strategies/main/user_data/strategies/Strategy001.py)



[第 3 课：freqtrade核心概念理解](https://dev.to/henry_lin_3ac6363747f45b4/di-3-ke-he-xin-gai-nian-li-jie-365c)



macd 长线，kdj 短线

超短线，短线 15，中长线 4h 



```bash
freqtrade download-data \
  -c user_data/config.json \
  --pairs-file user_data/pairs.json \
  --exchange binance \
  --days 90 \
  --timeframes 5m
```





download-data

list-data

list-strategies

```bash
freqtrade backtesting \
  -c user_data/config_backtest.json \
  --strategy Strategy001 \
  --timerange 20260801-20260904 \
  --timeframe 5m
```

创建一个新策略

```bash
freqtrade new-strategy --strategy FirstStrategy --template minimal
```

