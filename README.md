# node_test
Node Test mysql ./collections_api_mysql 
- nvm use v5.4.0
- npm install
- RUN with: PORT=3002 node server.api.js (OR export PORT=3002;node server.api.js)
 
# Test mysql ./collections_api_mysql 
Test with collection_id of collection_slug as follows
- /api/collections/:collection_id: e.g. http://localhost:3000/api/collections/1988
- /api/collections/:collection_slug: e.g. http://localhost:3000/api/collections/living-with-crohns
