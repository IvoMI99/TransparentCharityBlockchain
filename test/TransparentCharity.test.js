const { assert } = require("chai");
const CharityFactory = artifacts.require("CharityFactory");


describe('Testing CharityFactory contract', function() {
    contract('CharityFactory', () => {
        before(async () => {
            this.charityFactory = await CharityFactory.deployed();
        })

        it('deployed successfully', async () => {
            const addr = await this.charityFactory.address;
            assert.notEqual(addr, 0x0);
            assert.notEqual(addr, '');
            assert.notEqual(addr, null);
            assert.notEqual(addr, undefined);
        });

        it('check empty list of charities', async () => {
            const cnt = await this.charityFactory.cnt();
            const charity = await this.charityFactory.charities(cnt);
            assert.equal(cnt.toNumber(), 0);
            assert.equal(charity, 0x0);
        });

        it('add charity to list of charities', async () => {
            let name = "name";
            let desc = "desc";
            let amount = 1;
            let addr = '0x95E7813B58b131A3564Eb1db72A6D17047A4452C';
            let daysOpen = 1;
            let testAccoutn = process.env.TEST_ACCOUNT;

            await this.charityFactory.newCharity(name, desc, amount, addr, daysOpen, {from: testAccoutn});
            const charity = await this.charityFactory.charities(0);
            assert.notEqual(charity, 0x0);
        })
    });
});