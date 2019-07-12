git submodule foreach git pull origin bitmap-region
cat geometrize-js-prefix.txt > geometrizejs/src/geometrize.js
haxe build-js-target.hxml
cat geometrize.js >> geometrizejs/src/geometrize.js
mkdir -p geometrizejs/assets
cp geometrize.js.map geometrizejs/assets
rm -rf geometrize.js.*