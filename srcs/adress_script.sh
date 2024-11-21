#!/bin/bash

echo -n "export const ADRESS = \"" > static/javascript/adress.js
hostname | tr -d '\n' >> static/javascript/adress.js
echo -n "\";" >> static/javascript/adress.js