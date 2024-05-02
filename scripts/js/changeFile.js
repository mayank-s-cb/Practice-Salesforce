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

async function main(filePath){
    readXmlFile(filePath)
    .then( data => {
        var newData = data.toString()+' with new changes';
        fs.writeFile(filePath, newData);
    })
}

var filePath = './newDay.txt';
main(filePath);