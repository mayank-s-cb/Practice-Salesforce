var prettifyXml = require('prettify-xml');
const fs = require('fs').promises; // Use fs.promises for async file operations

var profileJson = "{}";
var convert = require('xml-js');
var profileXmlFile = "";
function convertXmlAndGetIpRange(xmlFile){
    var profileJson = convert.xml2json(xmlFile, { compact: true, spaces: 4 });
    const profileipRangeMap = extractAndMapIpRanges(profileJson);
    return profileipRangeMap;
}

function extractAndMapIpRanges(jsonData) {
    profileJson = JSON.parse(jsonData);
    var loginIpRanges;
    if(!profileJson.Profile.hasOwnProperty('loginIpRanges')){
        loginIpRanges = profileJson.Profile.loginIpRanges;
    }

    const ipRangeMap = new Map();

    if(Array.isArray(loginIpRanges)){
        loginIpRanges.forEach(range => {
            const startAddress = range.startAddress._text;
            const endAddress = range.endAddress._text;
            ipRangeMap.set(startAddress, endAddress);
        });
    }

    return ipRangeMap;
}


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

async function getProfileIpRanges(githubIpRanges, xmlFilePath){
    readXmlFile(xmlFilePath)
        .then(data => {
            const profileIpRanges = convertXmlAndGetIpRange(data.toString());
            if(!isIpRangesUptoDate(githubIpRanges,profileIpRanges)){
                profileJson.Profile.loginIpRanges = Array.from(githubIpRanges.entries()).map(([startAddress, endAddress]) => ({
                    startAddress: { _text: startAddress },
                    endAddress: { _text: endAddress }
                }));

                //console.log(JSON.stringify(profileJson, null, 2)); // Print the updated JSON
                var updatedProfileXml = prettifyXml(convert.json2xml(profileJson, {compact: true}), { indent: 4, newline: '\n' }); // options is optional
                //console.log(updatedProfileXml);
                fs.writeFile(xmlFilePath, updatedProfileXml);
                return updatedProfileXml;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function isIpRangesUptoDate(githubIpRanges, profileIpRanges){
    if(githubIpRanges.size != profileIpRanges.size){
        return false;
    }
    for(let startingIpAddress of githubIpRanges.keys()){
        if(profileIpRanges.has(startingIpAddress)){
            if(githubIpRanges.get() === profileIpRanges.get());
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    return true;
}

module.exports = {
    getProfileIpRanges: getProfileIpRanges
};