import { expect } from "chai";
import { network } from "hardhat";

describe("SmartHome", function () {

    // Test 1
    it("should set the deployer as admin", async function () {
        const { ethers } = await network.connect();

        const [admin] = await ethers.getSigners();

        const SmartHome = await ethers.getContractFactory("SmartHome");

        const smartHome = await SmartHome.deploy();

        await smartHome.waitForDeployment();

        const contractAdmin = await smartHome.getAdmin();

        expect(contractAdmin).to.equal(admin.address);
    });


    // Test 2
    it("should allow admin to add a user", async function () {
        const { ethers } = await network.connect();

        const [admin, user] = await ethers.getSigners();

        const SmartHome = await ethers.getContractFactory("SmartHome");

        const smartHome = await SmartHome.deploy();

        await smartHome.waitForDeployment();

        await smartHome.addUser(user.address);

        const isUserAuthorized =
            await smartHome.authorizedUsers(user.address);

        expect(isUserAuthorized).to.equal(true);
    });


    // Test 3
    it("should allow admin to grant device permission", async function () {

        const { ethers } = await network.connect();

        const [admin, user] = await ethers.getSigners();

        const SmartHome = await ethers.getContractFactory("SmartHome");

        const smartHome = await SmartHome.deploy();

        await smartHome.waitForDeployment();

        await smartHome.grantPermission(
            user.address,
            0
        );

        const hasPermission =
            await smartHome.hasDevicePermission(
                user.address,
                0
            );

        expect(hasPermission).to.equal(true);
    });

});



it("should allow an authorized user to turn on the light", async function () {

    const { ethers } = await network.connect();

    const [admin, user] = await ethers.getSigners();

    const SmartHome = await ethers.getContractFactory("SmartHome");

    const smartHome = await SmartHome.deploy();

    await smartHome.waitForDeployment();

    await smartHome.grantPermission(
        user.address,
        0
    );

    const userSmartHome =
        smartHome.connect(user);

    await userSmartHome.turnLightOn();

    const [active] =
        await smartHome.getDeviceState(0);

    expect(active).to.equal(true);
});


it("should reject an unauthorized user from controlling the light", async function () {

    const { ethers } = await network.connect();

    const [admin, user] = await ethers.getSigners();

    const SmartHome = await ethers.getContractFactory("SmartHome");

    const smartHome = await SmartHome.deploy();

    await smartHome.waitForDeployment();

    const unauthorizedUser =
        smartHome.connect(user);

    await expect(
        unauthorizedUser.turnLightOn()
    ).to.be.revertedWith("Access denied");
});


it("should prevent a user from controlling a device after permission is revoked", async function () {

    const { ethers } = await network.connect();

    const [admin, user] = await ethers.getSigners();

    const SmartHome = await ethers.getContractFactory("SmartHome");

    const smartHome = await SmartHome.deploy();

    await smartHome.waitForDeployment();

    // Give the user permission to control the light
    await smartHome.grantPermission(
        user.address,
        0
    );

    // Confirm permission was granted
    let hasPermission =
        await smartHome.hasDevicePermission(
            user.address,
            0
        );

    expect(hasPermission).to.equal(true);

    // Revoke the permission
    await smartHome.revokePermission(
        user.address,
        0
    );

    // Confirm permission was revoked
    hasPermission =
        await smartHome.hasDevicePermission(
            user.address,
            0
        );

    expect(hasPermission).to.equal(false);

    // Try controlling the light after permission was revoked
    const userSmartHome =
        smartHome.connect(user);

    await expect(
        userSmartHome.turnLightOn()
    ).to.be.revertedWith("Access denied");
});