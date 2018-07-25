Cloud Broker
=============

Web UI for Aurora

Requirements
========================================================================
1.	Git
2.	Node JS
•	Downl  ****oad the stable versión from https://nodejs.org/
•	Simple installation next, next, next on wizard
•	Try npm command on the command line, it should recognize the command.
3. Grunt
•	npm install -g grunt-cli
4. Bower
•	npm install -g bower


Requirements
========================================================================
- From git root cd to /aurora-ui
- npm install (this will install all the app related node modules)
- bower install


To test in express server
=========================
- grunt dev
This will launch an instance with the cloud-broker-ui to localhost:3000


To build the app and copy to aurora-core/webapp
===============================================
grunt build

To Install bower components
===========================
bower install slick-carousel --save --allow-root


Deploying apps to Heroku.
=========================
See Logs
•   heroku logs --app app_name

Deploying a war file
•   heroku deploy:war --war ./aurora.war --app aurora-d

Generate War.
=============
•   mvn install -DskipTests