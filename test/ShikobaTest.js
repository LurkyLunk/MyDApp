// Import the required npm packages
const { expect } = require("chai");

// Import your contract
const Shikoba = artifacts.require("Shikoba");

describe("Shikoba contract", () => {
  let shikoba;
  let accounts;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    shikoba = await Shikoba.new({ from: accounts[0] });
  });

  describe("Minting functionality", () => {
    it("should mint initial supply correctly", async () => {
      const initialBalance = await shikoba.balanceOf(accounts[0]);
      expect(initialBalance.toString()).to.equal(
        (10000000 * 10 ** 18).toString()
      );
    });

    it("should mint tokens correctly", async () => {
      const initialBalance = await shikoba.balanceOf(accounts[0]);
      await shikoba.mint(accounts[0], 1000, { from: accounts[0] });
      const finalBalance = await shikoba.balanceOf(accounts[0]);
      expect((finalBalance - initialBalance).toString()).to.equal(
        (1000).toString()
      );
    });

    it("should not allow non-owners to mint tokens", async () => {
      try {
        await shikoba.mint(accounts[1], 1000, { from: accounts[1] });
        assert.fail("Expected revert not received");
      } catch (error) {
        expect(error.message).to.include("Ownable: caller is not the owner");
      }
    });
  });

  describe("Pausing functionality", () => {
    it("should pause and unpause the contract correctly", async () => {
      await shikoba.pause({ from: accounts[0] });
      let paused = await shikoba.paused();
      expect(paused).to.be.true;

      await shikoba.unpause({ from: accounts[0] });
      paused = await shikoba.paused();
      expect(paused).to.be.false;
    });

    it("should not allow non-owners to pause or unpause the contract", async () => {
      try {
        await shikoba.pause({ from: accounts[1] });
        assert.fail("Expected revert not received");
      } catch (error) {
        expect(error.message).to.include("Ownable: caller is not the owner");
      }

      try {
        await shikoba.unpause({ from: accounts[1] });
        assert.fail("Expected revert not received");
      } catch (error) {
        expect(error.message).to.include("Ownable: caller is not the owner");
      }
    });
  });

  describe("Transfer functionality", () => {
    it("should not allow token transfers while paused", async () => {
      await shikoba.pause({ from: accounts[0] });
      let paused = await shikoba.paused();
      expect(paused).to.be.true;

      try {
        await shikoba.transfer(accounts[1], 1000, { from: accounts[0] });
        assert.fail("Expected revert not received");
      } catch (error) {
        expect(error.message).to.include("Pausable: paused");
      }

      await shikoba.unpause({ from: accounts[0] });
      paused = await shikoba.paused();
      expect(paused).to.be.false;

      await shikoba.transfer(accounts[1], 1000, { from: accounts[0] });
      const balance = await shikoba.balanceOf(accounts[1]);
      expect(balance.toString()).to.equal((1000).toString());
    });
  });
});
