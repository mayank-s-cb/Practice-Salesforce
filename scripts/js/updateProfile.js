"use strict";
Object.defineProperty(exports, "__esModule", { value: true })
const fs = require('fs').promises; // Use fs.promises for async file operations

function myFunction(){
    const xmlFilePath = './force-app/main/default/profiles/DX Integration Ip test profile.profile-meta.xml';
    const updatedProfileXml = process.env.updatedProfile;
    fs.writeFile(xmlFilePath, updatedProfileXml);
}

myFunction();