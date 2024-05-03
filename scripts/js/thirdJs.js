const core = require('@actions/core');
const fs = require('fs').promises; // Use fs.promises for async file operations

async function readXmlFile(filePath) {
    try {
        // Read the XML file asynchronously
        profileXmlFile = await fs.readFile(filePath, 'utf8');
        return profileXmlFile;
    } catch (error) {
        console.error('Error reading XML file:', error);
        throw error;
    }
}

async function main(firstJsValue , filePath){
    readXmlFile(filePath)
    .then( data => {
        console.log(data.toString());
        core.setOutput('newFile',data.toString());
    })
}
  
main('./newDay.txt')
