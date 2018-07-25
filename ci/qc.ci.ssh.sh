#!/bin/sh

echo "Cleaning web app..."
rm -rf /var/web/aurora/;
cd /var/lib/web/aurora-ui/;
echo "Fetching changes..."
git pull;
git checkout qc;
git pull;
echo "Updating dependencies..."
npm install;
bower install --allow-root;
echo "Building..."
grunt build;
echo "Copying..."
cp -r dist/ /var/web/aurora/;

echo "App deployed succesfully!"

exit;