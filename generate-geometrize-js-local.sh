cat geometrize-js-prefix.txt > geometrizejs/src/geometrize.js
haxe build-js-target-local.hxml
cat geometrize.js >> geometrizejs/src/geometrize.js
mkdir -p geometrizejs/assets
cp geometrize.js.map geometrizejs/assets
rm -rf geometrize.js.*