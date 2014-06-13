#!/bin/sh
python -m SimpleHTTPServer 8000 > http.log 2>&1 < /dev/null &
