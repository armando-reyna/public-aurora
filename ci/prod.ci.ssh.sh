#!/bin/sh

echo "Cleaning web app..."
rm -rf /var/www/vhosts/reservatuconsultorio.com/httpdocs/*;
cd /var/lib/web/aurora-ui/;
echo "Fetching changes..."
git pull;
git checkout prod;
git pull;
echo "Building..."
npm install;
bower install --allow-root;
grunt build;
echo "Copying..."
cp -r dist/* /var/www/vhosts/reservatuconsultorio.com/httpdocs/;

echo "App deployed succesfully!"

exit;