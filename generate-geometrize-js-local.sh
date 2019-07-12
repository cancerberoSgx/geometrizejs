GEOMETRIZE=/Users/sebastiangurin/git/geometrize-haxe
# CWD="$PWD"
cat geometrize-js-prefix.txt > geometrizejs/src/geometrize.js
haxe -lib sure -cp $GEOMETRIZE -debug -js geometrize.js    
cat geometrize.js >> geometrizejs/src/geometrize.js
mkdir -p geometrizejs/assets
cp geometrize.js.map geometrizejs/assets
rm -rf geometrize.js.*