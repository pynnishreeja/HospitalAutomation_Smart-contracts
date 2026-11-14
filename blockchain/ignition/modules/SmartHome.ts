import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SmartHomeModule = buildModule("SmartHomeModule", (m) => {

    const smartHome = m.contract("SmartHome");

    return {
        smartHome
    };
});

export default SmartHomeModule;
