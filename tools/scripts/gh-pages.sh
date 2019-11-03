node --max-old-space-size=8192 ./node_modules/.bin/ng build --prod --base-href /nform/ --deploy-url /nform/
node --max-old-space-size=8192 ./node_modules/.bin/ng run nform-demo-app:server:production --bundleDependencies all
npm run compile:server
node dist/server

cp dist/browser/index.html dist/browser/404.html

cd dist/browser

git init
git remote add origin git@github.com:shlomiassaf/nform.git
git add .
git commit -m "update"
git branch gh-pages
# git push --set-upstream origin gh-pages -f
git push --set-upstream origin gh-pages -f
