"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cidr_calc = require("cidr-calc");
var prettifyXml = require('prettify-xml');
var convert = require('xml-js');
const fs = require('fs').promises; // Use fs.promises for async file operations
const core = require('@actions/core');

class utility{

    profileJson;
    xmlFilePath;
    githubMetaApiUrl

    constructor(filePath, apiUrl){
        this.xmlFilePath = filePath;
        this.githubMetaApiUrl = apiUrl;
    }

    async getGithubIpRanges(){
        try {
            const response = await fetch(githubMetaApiUrl);
    
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

    async filterIpv4Ranges(actionIpRanges){
        const githubIpRanges = new Map();
        for(const iprange of actionIpRanges){
            const ipv4range = await this.getIpRanges(iprange);
            if(this.isIPv4(ipv4range.startIpAddr.toString())){
                githubIpRanges.set(ipv4range.startIpAddr.toString(), ipv4range.endIpAddr.toString());
            }
        }
        return githubIpRanges;
    }

    async getIpRanges(cidrRange) {
        var ipAddress = cidrRange.split('/');
        var cidr = new cidr_calc.Cidr(cidr_calc.IpAddress.of(ipAddress[0]), ipAddress[1]);
        var ipRange = cidr.toIpRange();
        return ipRange;
    }

    async isIPv4(address) {
        const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        return ipv4Regex.test(address);
    }  

    async readFile(){
        try {
            // Read the XML file asynchronously
            return await fs.readFile(this.xmlFilePath, 'utf8');
            
        } catch (error) {
            console.error('Error reading XML file:', error);
            throw error;
        }
    }

    async convertXmlAndGetIpRange(xmlFile){
        var profileJson = convert.xml2json(xmlFile, { compact: true, spaces: 4 });
        const profileipRangeMap = await this.extractAndMapIpRanges(profileJson);
        return profileipRangeMap;
    }

    async extractAndMapIpRanges(jsonData) {
        this.profileJson = JSON.parse(jsonData);
        var loginIpRanges;
        if(this.profileJson.Profile.hasOwnProperty('loginIpRanges')){
            loginIpRanges = this.profileJson.Profile.loginIpRanges;
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

    async ipRangesUpdated(githubIpRanges,profileIpRanges){
        if(githubIpRanges.size != profileIpRanges.size){
            console.log('Size Mismatch github : '+githubIpRanges.size+' and profile : '+profileIpRanges.size);
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

    async main(){
        var actionIpRanges = await this.getGithubIpRanges();
        const githubIpRanges = await this.filterIpv4Ranges(actionIpRanges);
        const profielXml = await this.readFile();
        const profileIpRanges = await this.convertXmlAndGetIpRange(profielXml);
        if(!await util.ipRangesUpdated(githubIpRanges,profileIpRanges)){
            this.profileJson.Profile.loginIpRanges = Array.from(githubIpRanges.entries()).map(([startAddress, endAddress]) => ({
                startAddress: { _text: startAddress },
                endAddress: { _text: endAddress }
            }));

            var updatedProfileXml = prettifyXml(convert.json2xml(this.profileJson, {compact: true}), { indent: 4, newline: '\n' }); // options is optional
            core.setOutput('updateNeeded',true);
            fs.writeFile(xmlFilePath, updatedProfileXml);
        }else{
            core.setOutput('updateNeeded',false);
        }
        
    }
}

const xmlFilePath = './force-app/main/default/profiles/DX Integration Ip test profile.profile-meta.xml';
const githubMetaApiUrl = 'https://api.github.com/meta';
const util = new utility(xmlFilePath, githubMetaApiUrl);
util.main();