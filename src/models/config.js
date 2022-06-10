// @ts-check

const config = {
    endpoint: process.env.cosmos_endpoint,
    key:process.env.cosmos_key,
    databaseId: "Tasks",
    containerId: "contract",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  };
  
  module.exports = config;
  