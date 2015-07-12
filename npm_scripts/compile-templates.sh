#!/usr/bin/env bash

for file in app/js/strikestarter/**/*.html; do

    filename=$(basename "$file")
    cp $file app/web/templates/$filename

done
