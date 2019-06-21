cat geometrize-js-prefix.txt > geometrizejs/src/geometrize.js
haxe build-js-target.hxml
cat geometrize.js >> geometrizejs/src/geometrize.js
rm -rf geometrize.js