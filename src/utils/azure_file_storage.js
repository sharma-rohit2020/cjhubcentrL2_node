const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
require('dotenv').config()
const AZURE_STORAGE_CONNECTION_STRING ='DefaultEndpointsProtocol=https;AccountName=cjweb;AccountKey=wco9WuRCzLBO8k1UcYcmFyfI8PAec/lpe8ILIxxJYdmZ49TEtivalU9AWCeLUiZqi7qYphDfEiw41eR2X80ncw==;EndpointSuffix=core.windows.net';
const containerName="cjhubcontainer";
const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(containerName);
async function main() { 

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
    }

    const createContainerResponse = await containerClient.create();
    console.log(
        "Container was created successfully. requestId: ",
        createContainerResponse.requestId
    );
}
async function blobList(){
    console.log("\nListing blobs...");
    // List the blob(s) in the container.
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log("\t", blob.name);
    }
}
async function uploadBlob(){
    // Create a unique name for the blob TestImage202.png

    const blobName = "quickstart" + uuidv1() + ".txt";
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    // Upload data to the blob
    const data = "Hello, World!";
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
    );
}
async function downloadBlob(){
    const blobName = "TestImage202.png";
    // Get a block blob client
   /*  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log("\nUploading to Azure storage as blob:\n\t", blobName); */
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log("\nDownloaded blob content...");
    console.log(
        "\t",
        await streamToText(downloadBlockBlobResponse.readableStreamBody)
    );
}
async function streamToText(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  }

  blobList() 
.then(() => console.log('Done'))
.catch((ex) => console.log(ex.message));