const { getIpRanges } = require('./convertIpCidr');
const { getProfileIpRanges } = require('./convertxmltojson');

async function fetchDataFromAPI(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.actions; // return the data fetched from the API
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // rethrow the error to handle it outside of this function
    }
}

// Function to check if an IP address is IPv4
function isIPv4(address) {
    // Regular expression to match IPv4 address format
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipv4Regex.test(address);
}  

async function main(){
    const actionIpRanges = await fetchDataFromAPI(apiUrl);
    const githubIpRanges = new Map();
    for(const iprange of actionIpRanges){
        const ipv4range = getIpRanges(iprange);
        if(isIPv4(ipv4range.startIpAddr.toString())){
            githubIpRanges.set(ipv4range.startIpAddr.toString(), ipv4range.endIpAddr.toString());
        }
    }
    //console.log(xmlFilePath);
    const ProfileIpRanges = await getProfileIpRanges(githubIpRanges, xmlFilePath);

}

const apiUrl = 'https://api.github.com/meta';
const xmlFilePath = '/Users/mayank/Documents/Org/Practice Salesforce/force-app/main/default/profiles/DX Integration Ip test profile.profile-meta.xml';
main();