"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cidr_calc_1 = require("cidr-calc");
//let cidr = new Cidr(IpAddress.of('192.168.0.0'), 16);
//let ipRange = cidr.toIpRange(); // 192.168.0.0 - 192.168.255.255
function getIpRanges(cidrRange) {
    var ipAddress = cidrRange.split('/');
    var cidr = new cidr_calc_1.Cidr(cidr_calc_1.IpAddress.of(ipAddress[0]), ipAddress[1]);
    var ipRange = cidr.toIpRange();
    return ipRange;
}
module.exports = {
    getIpRanges: getIpRanges
};