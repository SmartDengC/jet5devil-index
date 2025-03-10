---
title: 01JavaScript Drum Kit
author: 阿聪小破站
createTime: 2024/02/03 10:03:01
permalink: /vue/69crq7zv/
---

使用按键控制 audio 标签发出声音。

键盘按下去的时候，获取到按键的 keycode，在获取到对应的标签。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <audio src="assets/drumroll.mp3" data-key="65"></audio>
      <audio src="assets/drumroll.mp3" data-key="83"></audio>
      <audio src="assets/drumroll.mp3" data-key="68"></audio>
      <audio src="assets/drumroll.mp3" data-key="70"></audio>
    </div>
    <script>
      window.addEventListener("keydown", function (e) {
        // console.log(e.key);
        console.log(e.keyCode);
        const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
        console.log(audio);
        if (!audio) {
          return;
        }
        audio.currentTime = 0; // rewind the start
        audio.play();
      });
    </script>
  </body>
</html>
```

参考：[JS keydown 键盘事件](https://www.cnblogs.com/everlose/p/12499908.html)

code github site [wesbos/javascript30](https://github.com/wesbos/JavaScript30)

video site [javascript30](https://courses.wesbos.com/account)
