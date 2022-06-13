const CharityFactory = artifacts.require("CharityFactory");
const Receive = artifacts.require("Receive");
const Donation = artifacts.require("Donation");
const NGO = artifacts.require("NGO");
const CharityLib = artifacts.require("CharityLib");

const name = "name";
const desc = "desc";
const amount = 1;
const addr = '0x95E7813B58b131A3564Eb1db72A6D17047A4452C';
const daysOpen = 1;
const charity = CharityLib.Charity;

module.exports = function(deployer) {
    deployer.deploy(CharityFactory);
    deployer.deploy(Receive,name, desc, amount, addr, daysOpen);
    deployer.deploy(NGO, addr, name);
    deployer.deploy(Donation, NGO.address);
};
