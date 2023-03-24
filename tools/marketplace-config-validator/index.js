/* eslint-disable no-console */
const baseGoerliConfig = require('../../configs/marketplace/base-goerli.json') ;
const ethGoerliConfig = require('../../configs/marketplace/eth-goerli.json') ;
const { appItemOverviewSchema } = require('./schema.js');

console.log('Checking eth-goerli.json...');
appItemOverviewSchema.array().parse(ethGoerliConfig);
console.log('All good!');

console.log('Checking base-goerli.json...');
appItemOverviewSchema.array().parse(baseGoerliConfig);
console.log('All good!');
