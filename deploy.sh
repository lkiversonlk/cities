#!/bin/bash

git add .
git commit -m "auto"
git push
ssh root@39.104.106.42 << START
cd /root/workspace/cities
git pull
npm install
pm2 restart city
START