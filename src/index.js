const { Client } = require('darabok');
const { token, prefix, ownerID } = require('./data/config.json');

new Client({
    prefix: prefix, 
    ownerID: ownerID
}).login(token);