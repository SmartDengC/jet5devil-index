---
title: Python调用各大平台模型API
createTime: 2025/02/19 13:59:31
permalink: /article/o5nc3tnz/
tags:
  - aiApi
  - python
---



## Deepseek

```python
import json
import requests

url = 'https://api.deepseek.com/v1/chat/completions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 密钥'
}
paras = {
    # 如果是R1模型，"model": "deepseek-reasoner"
    "model": "deepseek-chat",
    "messages": [
        {"role": "user", "content": "你好，你是谁？"}
    ],
    "stream": False
}

ans = requests.post(url=url, json=paras, headers=headers)
msg = json.loads(ans.content)
if msg.get('error'):
    raise Exception(msg['error'])
data: dict = msg.get("choices")
for d in data:
    message = d.get('message')
    if message:
        print(message.get('content'))
```

返回

```
/Users/dengc4r/c4r_code/working/apaas_master/aipass/venv/bin/python3.9 /Users/dengc4r/c4r_code/working/apaas_master/aipass/tests/debug_scripts/script4.py 
您好！我是由中国的深度求索（DeepSeek）公司开发的智能助手DeepSeek-V3。如您有任何任何问题，我会尽我所能为您提供帮助。

Process finished with exit code 0
```



[api-docs deepseek](https://api-docs.deepseek.com/)

## Openai

```python
# openai
from openai import OpenAI
client = OpenAI()
completion = client.chat.completions.create(
    model="gpt-4o",
    store=True,
    messages=[
        {"role": "user", "content": "你好，你是谁？"}
    ]
)
```

## 超算平台api

```python
import json
import requests

url = 'http://activity.scnet.cn:61080/v1/chat/completions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 密钥'
}
paras = {
    "model": "deepseek-chat",
    "messages": [
        {"role": "user", "content": "你好，你是谁？"}
    ],
    "stream": False
}

ans = requests.post(url, json.dumps(paras), headers=headers)
msg = json.loads(ans.content)
if msg.get('error'):
    raise Exception(msg['error'])
data: dict = msg.get("choices")
for d in data:
    message = d.get('message')
    if message:
        print(message.get('content'))

```

[超算平台- R1模型镜像部署API](https://www.scnet.cn/help/docs/mainsite/ai/practice/deepseek-r1/index.html)
