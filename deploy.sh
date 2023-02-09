#!/bin/bash

PORT=$1

if [ -z $PORT ];then
    echo "PORT must be given!" 1>&2
    exit 1
fi

echo "Deploying on Port: $PORT"
sudo kill -9 $(sudo lsof -t -i:$PORT)
nohup static-http -p $PORT . > log.out &