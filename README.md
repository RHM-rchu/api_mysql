# NODE API MySQL Test

##Configs
Config file for, edit and change what you need:
`.env`
```
THEAPP=healthcommunities|hcn_collections
DB_USER=root
DB_PASSWD=
DB_HOST=127.0.0.1
DB_DATABASE=drupallocal_healthcentral
DB_DEBUG=0
DB_CONNECTIONLIMIT=100
```


##Setup
```
#node >=v5.10.1
nvm use 5.10.1
npm install
```

##Start Server
`node server.api.js`


##Dir structur
Using `THEAPP=hcn_collections` 
```
.
├── app
│   ├── hcn_collections_getTheData.js        <-- 1. process data
│   ├── ...
│   └── models
│       ├── mysql_connector.js               <-- process sql
│       ├── mysql_queries_hcn_collections.js <-- 2. custom sql for app
│       └── ...
├── routes
│   ├── hcn_collections.js                   <-- 3.routes per app
│   └── ...
└── server.api.js
```
1. *hcn\_collections\_getTheData.js* : Call mysql\_queies\_`:THEAPP` to process data from the database
2. *mysql\_queries\_hcn\_collections.js* : SQL File to send to MySQL
3. *hcn\_collections.js* : Routs for `:THEAPP`


##Test Routes
---
###hcn_collections
  - list collection types
    localhost:3000/api/collections/types
  - list all collections
    localhost:3000/api/collections/all
  - list single collection
    /api/collections/`:collection_id`
    localhost:3000/api/collections/1898
  - list single collection with associated articles
    /api/collections/`:collection_id`/articles
    localhost:3000/api/collections/1898/articles

---
###Healthcommunities
####Subcategories
   - list all
     _localhost:3000/api/subcat_
   - list articles: 
     /api/subcat/`:subcategory_id`
     localhost:3000/api/subcat/876

####Colections
   - list all: 
     localhost:3000/api/collections
   - list single collection
    /api/collections/`:collection_id`
    localhost:3000/api/collections/1
   - list single collection with associated articles
     /api/collections/`:collection_id`
     localhost:3000/api/collections/1



