# go-climbing
## About

### Contributors
* [Pierre Brengard](https://github.com/pbrengard)

## Architecture
* Server-side: [Node.js](http://nodejs.org), [Express](http://expressjs.com/), [Passport](http://www.passportjs.org)
* Client-side: [Material-ui](https://material-ui-next.com), [React](https://reactjs.org)

## Configuration
Rename server/config.tpl.js to config.js and replace Google identifiers by yours. You can declare an web application in the Google Developers Console [https://console.developers.google.com/apis]

### Run on Cloud9
Share your application. This is needed to avoid errors because of HTTP/HTTPS connection errors and issues related to cross-domain access.
Use Node v8

    nvm use v8
Install MongoDB

    sudo apt-get install -y mongodb-org
If the MongoDB wasn't properly shut down

    mongod --dbpath /data/db --repair
    
Get dependencies
    npm install

## Start application

    mongod --bind_ip=$IP --nojournal
    npm run build
    node server/server.js
