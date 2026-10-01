#!/bin/zsh
cd -- "${0:A:h}"
echo '新标准日本语学习应用：http://localhost:5180'
echo '请保持本窗口打开；按 Control+C 停止服务。'
python3 -m http.server 5180 --bind 127.0.0.1
