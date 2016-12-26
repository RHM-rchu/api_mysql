# NODE API MySQL Test

##Configs
Config file for, edit and change what you need:
`.env`
```
DB_USER=root
DB_PASSWD=
DB_HOST=127.0.0.1
DB_DATABASE=drupallocal_healthcentral
DB_DEBUG=0
DB_CONNECTIONLIMIT=100
```


##Setup
`node >=v5.10.1`
`npm install`

##Start Server
`node server.api.js`

##Test Routes
localhost:3000/api/collections/1898
localhost:3000/api/collections/1898/articles