import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

const imgUri = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgY2xhc3M9Imljb24iICB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQ1OC45IDQzNC42YzAgMTU3LTg5LjEgMjIxLjMtMTk5IDIyMS4zcy0xOTktNjQuMy0xOTktMjIxLjMgMTk5LTQxMC4yIDE5OS00MTAuMiAxOTkgMjUzLjIgMTk5IDQxMC4yeiIgZmlsbD0iIzYwQzEzRCIgLz48cGF0aCBkPSJNMjU5LjkgNjY1LjljLTYwLjYgMC0xMTEuNy0xOC45LTE0Ny43LTU0LjdDNzEuNiA1NzAuOSA1MSA1MTEuNSA1MSA0MzQuNmMwLTY2LjkgMzMuOS0xNTcuNSAxMDAuOS0yNjkuMUMyMDEuMyA4MyAyNTEuNSAxOC45IDI1MiAxOC4zYzEuOS0yLjQgNC44LTMuOCA3LjktMy44czYgMS40IDcuOSAzLjhjMC41IDAuNiA1MC43IDY0LjcgMTAwLjIgMTQ3LjMgNjcgMTExLjYgMTAwLjkgMjAyLjIgMTAwLjkgMjY5LjEgMCA3Ni45LTIwLjYgMTM2LjMtNjEuMiAxNzYuNi0zNi4yIDM1LjctODcuMiA1NC42LTE0Ny44IDU0LjZ6IG0wLTYyNWMtMTUuOSAyMS4yLTUzLjcgNzIuOC05MSAxMzUuMUMxMjQuMiAyNTAuNSA3MSAzNTUuOSA3MSA0MzQuNmMwIDcxLjQgMTguNiAxMjYgNTUuMyAxNjIuNCAzMi4yIDMyIDc4LjUgNDguOSAxMzMuNiA0OC45UzM2MS4zIDYyOSAzOTMuNSA1OTdjMzYuNy0zNi40IDU1LjMtOTEgNTUuMy0xNjIuNCAwLTc4LjgtNTMuMy0xODQuMi05OC4xLTI1OC44LTM3LjItNjIuMi03NC45LTExMy44LTkwLjgtMTM0Ljl6IiBmaWxsPSIiIC8+PHBhdGggZD0iTTI1OS45IDc3MS4xYy01LjUgMC0xMC00LjUtMTAtMTBWMTczLjNjMC01LjUgNC41LTEwIDEwLTEwczEwIDQuNSAxMCAxMHY1ODcuOGMwIDUuNi00LjUgMTAtMTAgMTB6IiBmaWxsPSIiIC8+PHBhdGggZD0iTTI1OS45IDQwMS4zYy0yLjcgMC01LjUtMS4xLTcuNC0zLjNMMTUwIDI4My45Yy0zLjctNC4xLTMuNC0xMC40IDAuOC0xNC4xIDQuMS0zLjcgMTAuNC0zLjQgMTQuMSAwLjhsMTAyLjUgMTE0LjFjMy43IDQuMSAzLjQgMTAuNC0wLjggMTQuMS0xLjkgMS42LTQuMyAyLjUtNi43IDIuNXpNMjMxLjQgNTE4LjVjLTIuOCAwLTUuNi0xLjItNy42LTMuNUwxNDUgNDIyLjVjLTMuNi00LjItMy4xLTEwLjUgMS4xLTE0LjEgNC4yLTMuNiAxMC41LTMuMSAxNC4xIDEuMUwyMzkgNTAyYzMuNiA0LjIgMy4xIDEwLjUtMS4xIDE0LjEtMS45IDEuNi00LjIgMi40LTYuNSAyLjR6TTI1OS45IDI4Ny4yYy0yLjYgMC01LjEtMS03LjEtMi45LTMuOS0zLjktMy45LTEwLjIgMC0xNC4xbDY5LjQtNjkuNGMzLjktMy45IDEwLjItMy45IDE0LjEgMHMzLjkgMTAuMiAwIDE0LjFMMjY3IDI4NC4zYy0yIDEuOS00LjYgMi45LTcuMSAyLjl6TTI2Ni42IDQ5MS43Yy0yLjcgMC01LjUtMS4xLTcuNC0zLjMtMy43LTQuMS0zLjMtMTAuNCAwLjgtMTQuMWwxMDEuMi05MC44YzQuMS0zLjcgMTAuNC0zLjMgMTQuMSAwLjggMy43IDQuMSAzLjMgMTAuNC0wLjggMTQuMWwtMTAxLjIgOTAuOGMtMS45IDEuNy00LjMgMi41LTYuNyAyLjV6IiBmaWxsPSIiIC8+PHBhdGggZD0iTTc5OC4xIDU4OC44aC02N2MtOC42LTE4LjctNzcuNS0xNTcuOS0yNzguNC0xNTcuOC0xNDkuMyAwLTQzNy4yIDE1Ni45LTQyNC4zIDE5NC4yIDYuNiAxOS4yIDE5LjQgMzAuMyAyMy43IDgwLjcgMy4xIDM1LjggMTAuNCA4MC4xIDEwLjQgODAuMSAwIDU1LjkgNDUuMyAxMDEuMyAxMDEuMyAxMDEuM0g5OTh2LTEzM2MwLTExMC41LTg5LjUtMTY1LjUtMTk5LjktMTY1LjV6IiBmaWxsPSIjRDY0RjM0IiAvPjxwYXRoIGQ9Ik05OTggODk3LjJIMTYzLjdjLTYxLjEgMC0xMTAuOC00OS41LTExMS4zLTExMC40LTEtNi4yLTcuNS00Ni45LTEwLjQtODAuMS0zLTM1LjEtMTAuMS00OS44LTE2LjQtNjIuNy0yLjUtNS4xLTQuOC0xMC02LjgtMTUuNi0yLjMtNi44LTAuNS0xNC41IDUuNi0yMyAxOS44LTI3LjggOTEtNzMuMiAxNzcuMy0xMTMgOTguNC00NS40IDE4OS44LTcxLjUgMjUwLjgtNzEuNWgwLjJjMTg5LjkgMCAyNjUuOCAxMjEgMjg0LjUgMTU3LjhoNjAuN2M1OS4yIDAgMTEwLjIgMTUgMTQ3LjQgNDMuNCA0MC45IDMxLjIgNjIuNSA3Ni44IDYyLjUgMTMyLjF2MTMzYzAuMiA1LjUtNC4yIDEwLTkuOCAxMHpNMzggNjIyLjRjMS42IDQuNCAzLjUgOC40IDUuNyAxMyA2LjcgMTMuNyAxNSAzMC45IDE4LjMgNjkuNyAzIDM1IDEwLjIgNzguOSAxMC4zIDc5LjMgMC4xIDAuNSAwLjEgMS4xIDAuMSAxLjYgMCA1MC4zIDQwLjkgOTEuMyA5MS4zIDkxLjNIOTg4di0xMjNjMC00OC44LTE4LjktODktNTQuNi0xMTYuMi0zMy43LTI1LjctODAuNS0zOS4zLTEzNS4zLTM5LjNoLTY3Yy0zLjkgMC03LjQtMi4zLTkuMS01LjgtMTEuNy0yNS40LTc5LjgtMTUyLTI2OS4yLTE1MmgtMC4yYy02Mi4xIDAtMTU5LjkgMjkuNS0yNjEuNyA3OC43LTQyLjYgMjAuNi04MS44IDQzLTExMC41IDYyLjktMzguMiAyNi43LTQyIDM4LjEtNDIuNCAzOS44eiBtMCAwLjJ6IiBmaWxsPSIiIC8+PHBhdGggZD0iTTQ1Mi43IDQzMC45Yy02My41IDAtMTQzIDMxLjgtMjIxLjYgNzEuOGw2MSAxNjAuNmgzNzAuMmw2OC45LTc0LjZjLTguNy0xOC42LTc3LjUtMTU3LjktMjc4LjUtMTU3Ljh6IiBmaWxsPSIjODBGOUU3IiAvPjxwYXRoIGQ9Ik02NjIuMyA2NzMuNEgyOTIuMWMtNC4yIDAtNy45LTIuNi05LjMtNi41bC02MS0xNjAuNmMtMS44LTQuOCAwLjMtMTAuMSA0LjgtMTIuNSA5Ny42LTQ5LjcgMTY5LjUtNzIuOSAyMjYuMi03Mi45aDAuMmMyMDEuNiAwIDI3NC43IDEzNi4zIDI4Ny4zIDE2My43IDEuNyAzLjcgMSA4LTEuNyAxMWwtNjguOSA3NC42Yy0yIDItNC42IDMuMi03LjQgMy4yeiBtLTM2My4zLTIwaDM1OC45bDYxLjMtNjYuNGMtMTcuOS0zNC45LTg4LjgtMTQ2LjEtMjY2LjMtMTQ2LjFoLTAuMmMtNTEuMiAwLTExOS42IDIxLjgtMjA5LjEgNjYuN0wyOTkgNjUzLjR6IG0xNTMuNy0yMjIuNXoiIGZpbGw9IiIgLz48cGF0aCBkPSJNNDc3LjIgNDMwLjl2MjMyLjUiIGZpbGw9IiM4MEY5RTciIC8+PHBhdGggZD0iTTQ3Ny4yIDY3My40Yy01LjUgMC0xMC00LjUtMTAtMTBWNDMwLjljMC01LjUgNC41LTEwIDEwLTEwczEwIDQuNSAxMCAxMHYyMzIuNWMwIDUuNS00LjUgMTAtMTAgMTB6IiBmaWxsPSIiIC8+PHBhdGggZD0iTTI3NC44IDg4Ny4ybS0xMDMuMyAwYTEwMy4zIDEwMy4zIDAgMSAwIDIwNi42IDAgMTAzLjMgMTAzLjMgMCAxIDAtMjA2LjYgMFoiIGZpbGw9IiNCNkI3QjciIC8+PHBhdGggZD0iTTI3NC44IDEwMDAuNWMtNjIuNSAwLTExMy4zLTUwLjgtMTEzLjMtMTEzLjNzNTAuOC0xMTMuMyAxMTMuMy0xMTMuMyAxMTMuMyA1MC44IDExMy4zIDExMy4zLTUwLjggMTEzLjMtMTEzLjMgMTEzLjN6IG0wLTIwNi42Yy01MS41IDAtOTMuMyA0MS45LTkzLjMgOTMuMyAwIDUxLjUgNDEuOSA5My4zIDkzLjMgOTMuMyA1MS41IDAgOTMuMy00MS45IDkzLjMtOTMuM3MtNDEuOC05My4zLTkzLjMtOTMuM3oiIGZpbGw9IiIgLz48cGF0aCBkPSJNNzY1LjYgODg3LjJtLTEwMy4zIDBhMTAzLjMgMTAzLjMgMCAxIDAgMjA2LjYgMCAxMDMuMyAxMDMuMyAwIDEgMC0yMDYuNiAwWiIgZmlsbD0iI0I2QjdCNyIgLz48cGF0aCBkPSJNNzY1LjYgMTAwMC41Yy02Mi41IDAtMTEzLjMtNTAuOC0xMTMuMy0xMTMuM3M1MC44LTExMy4zIDExMy4zLTExMy4zIDExMy4zIDUwLjggMTEzLjMgMTEzLjMtNTAuOCAxMTMuMy0xMTMuMyAxMTMuM3ogbTAtMjA2LjZjLTUxLjUgMC05My4zIDQxLjktOTMuMyA5My4zIDAgNTEuNSA0MS45IDkzLjMgOTMuMyA5My4zczkzLjMtNDEuOSA5My4zLTkzLjMtNDEuOS05My4zLTkzLjMtOTMuM3oiIGZpbGw9IiIgLz48cGF0aCBkPSJNNDQzLjUgMTAwOS4xSDU5LjZjLTUuNSAwLTEwLTQuNS0xMC0xMHM0LjUtMTAgMTAtMTBoMzgzLjljNS41IDAgMTAgNC41IDEwIDEwcy00LjUgMTAtMTAgMTB6TTk5MC4yIDEwMDkuMUg2MDYuM2MtNS41IDAtMTAtNC41LTEwLTEwczQuNS0xMCAxMC0xMGgzODMuOWM1LjUgMCAxMCA0LjUgMTAgMTBzLTQuNSAxMC0xMCAxMHoiIGZpbGw9IiIgLz48L3N2Zz4=";
describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNft() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, add1, addr2, addr3] = await hre.ethers.getSigners();

    const Nft = await hre.ethers.getContractFactory("MyNft");
    const nft = await Nft.deploy();

    return { nft, owner, otherAccount, add1, addr2, addr3 };
  }

  async function deployEventFactory() {
    const { nft } = await loadFixture(deployNft);
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, add1, addr2, addr3] = await hre.ethers.getSigners();

    const EventFactory = await hre.ethers.getContractFactory("EventFactory");
    const eventFactory = await EventFactory.deploy();

    return { eventFactory, nft, owner, otherAccount, add1, addr2, addr3 };
  }

  describe("Deployment", function () {
    it("Should mint nft to msg.sender", async function () {
      const { nft, owner } = await loadFixture(deployNft);
      await nft.mint(imgUri);
      expect(await nft.balanceOf(owner.address)).to.equal(1);
    });


  });

  describe("Deploy EventFactory", function () {
    it("Should create event", async function () {
      const { nft, owner, eventFactory } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 20, "first event", closeTime);
      await nft.mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));

      await event.registerForEvent()
      expect(await event.hasRegistered(owner)).to.be.equal(true);

    });


  });

  describe("Event Registeration", function () {
    it("Should allow nft holder register", async function () {
      const { nft, owner, eventFactory } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 20, "first event", closeTime);
      await nft.mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));
      await event.registerForEvent();
      expect(await event.hasRegistered(owner)).to.be.equal(true);

    });


    it("Should not allow non nft holder register", async function () {
      const { nft, owner, eventFactory } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 20, "first event", closeTime);
      // await nft.mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));
      await expect(event.registerForEvent()).to.be.revertedWith("You do not own the required ticket");
    });
    it("Should fail if nft holder already registered", async function () {
      const { nft, owner, eventFactory } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 20, "first event", closeTime);
      await nft.mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));
      await event.registerForEvent();
      await expect(event.registerForEvent()).to.be.revertedWith("Already registered");

    });

    it("Should fail if holder try to register when event is closed", async function () {
      const { nft, owner, eventFactory } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 20, "first event", closeTime);
      await nft.mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));
      await time.increaseTo(closeTime);
      await expect(event.registerForEvent()).to.be.revertedWith("Event is over");

    });

    it("Should fail if event capacity is full", async function () {
      const { nft, owner, eventFactory, add1, addr2 } = await loadFixture(deployEventFactory);
      const closeTime = await time.latest() + 30 * 24 * 60 * 60;
      await eventFactory.createEvent(nft, 2, "first event", closeTime);
      await nft.mint(imgUri);
      await nft.connect(add1).mint(imgUri);
      await nft.connect(addr2).mint(imgUri);
      const event = await ethers.getContractAt("EventContract", await eventFactory.getEventContract(1));
      await event.registerForEvent();
      await event.connect(add1).registerForEvent();

      await expect(event.connect(addr2).registerForEvent()).to.be.revertedWith("Event is full");

    });


  });
});
