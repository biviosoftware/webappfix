#!/bin/sh
dir=$(pwd)
cd ..
kill $(cat http.pid)
python -m SimpleHTTPServer 8000 > $dir/http.log 2>&1 < /dev/null &
echo $! > http.pid
