import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  // Light
  "function turnLightOn(uint256 roomNumber) external",
  "function turnLightOff(uint256 roomNumber) external",

  // Fan
  "function turnFanOn(uint256 roomNumber) external",
  "function turnFanOff(uint256 roomNumber) external",
  "function setFanSpeed(uint256 roomNumber, uint256 speed) external",

  // AC
  "function turnACOn(uint256 roomNumber) external",
  "function turnACOff(uint256 roomNumber) external",
  "function setACTemperature(uint256 roomNumber, uint256 temperature) external",

  // Door
  "function unlockDoor(uint256 roomNumber) external",
  "function lockDoor(uint256 roomNumber) external",

  // Camera
  "function turnCameraOn(uint256 roomNumber) external",
  "function turnCameraOff(uint256 roomNumber) external",

  // Thermostat
  "function setThermostatTemperature(uint256 roomNumber, uint256 temperature) external",

  // Window
  "function openWindow(uint256 roomNumber) external",
  "function closeWindow(uint256 roomNumber) external",

  // Alarm
  "function armAlarm(uint256 roomNumber) external",
  "function disarmAlarm(uint256 roomNumber) external",

  // Patient TV
  "function turnPatientTVOn(uint256 roomNumber) external",
  "function turnPatientTVOff(uint256 roomNumber) external",
  "function setPatientTVVolume(uint256 roomNumber, uint256 volume) external",

  // Nurse Call
  "function activateNurseCall(uint256 roomNumber) external",
  "function resetNurseCall(uint256 roomNumber) external",

  // Patient Bed
  "function raisePatientBed(uint256 roomNumber) external",
  "function lowerPatientBed(uint256 roomNumber) external",

  // Bedside Lamp
  "function turnBedsideLampOn(uint256 roomNumber) external",
  "function turnBedsideLampOff(uint256 roomNumber) external",

  // Exhaust Fan
  "function turnExhaustFanOn(uint256 roomNumber) external",
  "function turnExhaustFanOff(uint256 roomNumber) external",

  // Room Monitor
  "function turnRoomMonitorOn(uint256 roomNumber) external",
  "function turnRoomMonitorOff(uint256 roomNumber) external",

  // State
  "function getDeviceState(uint256 roomNumber, uint8 device) external view returns (bool active, uint256 value)",

  // Device availability
  "function isDeviceAvailable(uint256 roomNumber, uint8 device) external view returns (bool)",

  // Admin
  "function getAdmin() external view returns (address)"
];

const DEVICE = {
  Light: 0,
  Fan: 1,
  AirConditioner: 2,
  Door: 3,
  Camera: 4,
  Thermostat: 5,
  Window: 6,
  Alarm: 7,
  PatientTV: 8,
  NurseCall: 9,
  PatientBed: 10,
  BedsideLamp: 11,
  ExhaustFan: 12,
  RoomMonitor: 13
};

const ROOM_TYPES = {
  101: "General Ward",
  102: "General Ward",
  103: "General Ward",
  104: "General Ward",
  201: "ICU",
  202: "ICU",
  301: "Operation Theatre",
  302: "Operation Theatre"
};

function App() {
  const [account, setAccount] = useState("");

  const [roomNumber, setRoomNumber] = useState(101);
  const [availableDevices, setAvailableDevices] = useState({});

  const [light, setLight] = useState(false);

  const [fan, setFan] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(1);

  const [ac, setAc] = useState(false);
  const [acTemperature, setAcTemperature] = useState(24);

  const [doorLocked, setDoorLocked] = useState(true);

  const [camera, setCamera] = useState(false);

  const [thermostatTemperature, setThermostatTemperature] =
    useState(24);

  const [windowOpen, setWindowOpen] = useState(false);

  const [alarm, setAlarm] = useState(false);

  const [patientTV, setPatientTV] = useState(false);
  const [patientTVVolume, setPatientTVVolume] = useState(10);

  const [nurseCall, setNurseCall] = useState(false);

  const [patientBedRaised, setPatientBedRaised] =
    useState(false);

  const [bedsideLamp, setBedsideLamp] = useState(false);

  const [exhaustFan, setExhaustFan] = useState(false);

  const [roomMonitor, setRoomMonitor] = useState(false);

  // =========================================================
  // CONTRACT
  // =========================================================

  const getContract = async () => {
    const provider =
      new ethers.BrowserProvider(window.ethereum);

    const signer =
      await provider.getSigner();

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
  };

  // =========================================================
  // CHECK DEVICE AVAILABILITY
  // =========================================================

  const checkDeviceAvailability = async (room) => {
    try {
      const provider =
        new ethers.BrowserProvider(window.ethereum);

      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

      const devices = {};

      for (let i = 0; i <= 13; i++) {
        devices[i] =
          await contract.isDeviceAvailable(
            room,
            i
          );
      }

      setAvailableDevices(devices);
    } catch (error) {
      // No message displayed
    }
  };

  // =========================================================
  // LOAD DEVICE STATES
  // =========================================================

  const loadDeviceStates = async (room) => {
    try {
      const provider =
        new ethers.BrowserProvider(window.ethereum);

      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

      await checkDeviceAvailability(room);

      // Light
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Light
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Light
          );

        setLight(state[0]);
      }

      // Fan
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Fan
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Fan
          );

        setFan(state[0]);
        setFanSpeed(Number(state[1]));
      }

      // AC
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.AirConditioner
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.AirConditioner
          );

        setAc(state[0]);
        setAcTemperature(Number(state[1]));
      }

      // Door
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Door
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Door
          );

        setDoorLocked(
          Number(state[1]) === 1
        );
      }

      // Camera
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Camera
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Camera
          );

        setCamera(state[0]);
      }

      // Thermostat
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Thermostat
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Thermostat
          );

        setThermostatTemperature(
          Number(state[1])
        );
      }

      // Window
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Window
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Window
          );

        setWindowOpen(
          Number(state[1]) === 1
        );
      }

      // Alarm
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.Alarm
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.Alarm
          );

        setAlarm(state[0]);
      }

      // Patient TV
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.PatientTV
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.PatientTV
          );

        setPatientTV(state[0]);
        setPatientTVVolume(
          Number(state[1])
        );
      }

      // Nurse Call
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.NurseCall
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.NurseCall
          );

        setNurseCall(state[0]);
      }

      // Patient Bed
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.PatientBed
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.PatientBed
          );

        setPatientBedRaised(
          Number(state[1]) === 1
        );
      }

      // Bedside Lamp
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.BedsideLamp
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.BedsideLamp
          );

        setBedsideLamp(state[0]);
      }

      // Exhaust Fan
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.ExhaustFan
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.ExhaustFan
          );

        setExhaustFan(state[0]);
      }

      // Room Monitor
      if (
        await contract.isDeviceAvailable(
          room,
          DEVICE.RoomMonitor
        )
      ) {
        const state =
          await contract.getDeviceState(
            room,
            DEVICE.RoomMonitor
          );

        setRoomMonitor(state[0]);
      }

    } catch (error) {
      // No message displayed
    }
  };

  // =========================================================
  // CONNECT WALLET
  // =========================================================

  const connectWallet = async () => {
    if (!window.ethereum) {
      return;
    }

    try {
      try {
        await window.ethereum.request({
          method:
            "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x7A69"
            }
          ]
        });

      } catch (switchError) {

        if (switchError.code === 4902) {

          await window.ethereum.request({
            method:
              "wallet_addEthereumChain",

            params: [
              {
                chainId: "0x7A69",

                chainName:
                  "Hardhat Local",

                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18
                },

                rpcUrls: [
                  "http://127.0.0.1:8545"
                ]
              }
            ]
          });

        } else {
          return;
        }
      }

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      const address =
        await signer.getAddress();

      setAccount(address);

      await loadDeviceStates(101);

    } catch (error) {
      // Absolutely no transaction/wallet message displayed
    }
  };

  // =========================================================
  // CHANGE ROOM
  // =========================================================

  const changeRoom = async (room) => {

    const selectedRoom =
      Number(room);

    setRoomNumber(selectedRoom);

    await loadDeviceStates(
      selectedRoom
    );
  };

  // =========================================================
  // EXECUTE BLOCKCHAIN TRANSACTION
  // =========================================================

  const execute = async (action) => {

    try {

      const contract =
        await getContract();

      const transaction =
        await action(contract);

      await transaction.wait();

      await loadDeviceStates(
        roomNumber
      );

    } catch (error) {
      // No transaction message displayed
    }
  };

  // =========================================================
  // LIGHT
  // =========================================================

  const toggleLight = () => {

    if (light) {

      execute(
        (contract) =>
          contract.turnLightOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnLightOn(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // FAN
  // =========================================================

  const toggleFan = () => {

    if (fan) {

      execute(
        (contract) =>
          contract.turnFanOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnFanOn(
            roomNumber
          )
      );
    }
  };

  const changeFanSpeed = () => {

    execute(
      (contract) =>
        contract.setFanSpeed(
          roomNumber,
          fanSpeed
        )
    );
  };

  // =========================================================
  // AC
  // =========================================================

  const toggleAC = () => {

    if (ac) {

      execute(
        (contract) =>
          contract.turnACOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnACOn(
            roomNumber
          )
      );
    }
  };

  const changeACTemperature = () => {

    execute(
      (contract) =>
        contract.setACTemperature(
          roomNumber,
          acTemperature
        )
    );
  };

  // =========================================================
  // DOOR
  // =========================================================

  const toggleDoor = () => {

    if (doorLocked) {

      execute(
        (contract) =>
          contract.unlockDoor(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.lockDoor(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // CAMERA
  // =========================================================

  const toggleCamera = () => {

    if (camera) {

      execute(
        (contract) =>
          contract.turnCameraOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnCameraOn(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // THERMOSTAT
  // =========================================================

  const changeThermostatTemperature = () => {

    execute(
      (contract) =>
        contract.setThermostatTemperature(
          roomNumber,
          thermostatTemperature
        )
    );
  };

  // =========================================================
  // WINDOW
  // =========================================================

  const toggleWindow = () => {

    if (windowOpen) {

      execute(
        (contract) =>
          contract.closeWindow(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.openWindow(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // ALARM
  // =========================================================

  const toggleAlarm = () => {

    if (alarm) {

      execute(
        (contract) =>
          contract.disarmAlarm(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.armAlarm(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // PATIENT TV
  // =========================================================

  const togglePatientTV = () => {

    if (patientTV) {

      execute(
        (contract) =>
          contract.turnPatientTVOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnPatientTVOn(
            roomNumber
          )
      );
    }
  };

  const changePatientTVVolume = () => {

    execute(
      (contract) =>
        contract.setPatientTVVolume(
          roomNumber,
          patientTVVolume
        )
    );
  };

  // =========================================================
  // NURSE CALL
  // =========================================================

  const toggleNurseCall = () => {

    if (nurseCall) {

      execute(
        (contract) =>
          contract.resetNurseCall(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.activateNurseCall(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // PATIENT BED
  // =========================================================

  const togglePatientBed = () => {

    if (patientBedRaised) {

      execute(
        (contract) =>
          contract.lowerPatientBed(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.raisePatientBed(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // BEDSIDE LAMP
  // =========================================================

  const toggleBedsideLamp = () => {

    if (bedsideLamp) {

      execute(
        (contract) =>
          contract.turnBedsideLampOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnBedsideLampOn(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // EXHAUST FAN
  // =========================================================

  const toggleExhaustFan = () => {

    if (exhaustFan) {

      execute(
        (contract) =>
          contract.turnExhaustFanOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnExhaustFanOn(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // ROOM MONITOR
  // =========================================================

  const toggleRoomMonitor = () => {

    if (roomMonitor) {

      execute(
        (contract) =>
          contract.turnRoomMonitorOff(
            roomNumber
          )
      );

    } else {

      execute(
        (contract) =>
          contract.turnRoomMonitorOn(
            roomNumber
          )
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      <h1>
        Hospital Room Automation System
      </h1>

      <p>
        Blockchain-Based Hospital Room Management
        and Smart Device Access Control
      </p>

      <button onClick={connectWallet}>
        {account
          ? "Wallet Connected"
          : "Connect MetaMask"}
      </button>

      {account && (
        <div>
          <p>Account:</p>
          <p>{account}</p>
        </div>
      )}

      {account && (
        <>
          {/* ROOM SELECTION */}

          <div className="room-selector">

            <h2>
              Hospital Room Selection
            </h2>

            <label>
              Select Room:

              <select
                value={roomNumber}
                onChange={(e) =>
                  changeRoom(e.target.value)
                }
              >

                <option value={101}>
                  Room 101 - General Ward
                </option>

                <option value={102}>
                  Room 102 - General Ward
                </option>

                <option value={103}>
                  Room 103 - General Ward
                </option>

                <option value={104}>
                  Room 104 - General Ward
                </option>

                <option value={201}>
                  Room 201 - ICU
                </option>

                <option value={202}>
                  Room 202 - ICU
                </option>

                <option value={301}>
                  Room 301 - Operation Theatre
                </option>

                <option value={302}>
                  Room 302 - Operation Theatre
                </option>

              </select>
            </label>

            <h3>
              Room {roomNumber}
            </h3>

            <p>
              Type: {ROOM_TYPES[roomNumber]}
            </p>

          </div>

          {/* DEVICES */}

          <div className="devices">

            {/* LIGHT */}

            {availableDevices[DEVICE.Light] && (
              <div className="device">

                <h2>
                  💡 Room Light
                </h2>

                <p>
                  Status:{" "}
                  {light ? "ON" : "OFF"}
                </p>

                <button
                  onClick={toggleLight}
                >
                  {light
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

              </div>
            )}

            {/* FAN */}

            {availableDevices[DEVICE.Fan] && (
              <div className="device">

                <h2>
                  🌀 Ceiling Fan
                </h2>

                <p>
                  Status:{" "}
                  {fan ? "ON" : "OFF"}
                </p>

                <button
                  onClick={toggleFan}
                >
                  {fan
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

                <br />

                <label>
                  Speed:

                  <select
                    value={fanSpeed}
                    onChange={(e) =>
                      setFanSpeed(
                        Number(e.target.value)
                      )
                    }
                  >

                    <option value={1}>
                      1
                    </option>

                    <option value={2}>
                      2
                    </option>

                    <option value={3}>
                      3
                    </option>

                    <option value={4}>
                      4
                    </option>

                    <option value={5}>
                      5
                    </option>

                  </select>
                </label>

                <button
                  onClick={changeFanSpeed}
                >
                  Set Speed
                </button>

              </div>
            )}

            {/* AC */}

            {availableDevices[
              DEVICE.AirConditioner
            ] && (
              <div className="device">

                <h2>
                  ❄️ Air Conditioner
                </h2>

                <p>
                  Status:{" "}
                  {ac ? "ON" : "OFF"}
                </p>

                <p>
                  Temperature:{" "}
                  {acTemperature}°C
                </p>

                <button
                  onClick={toggleAC}
                >
                  {ac
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

                <br />

                <input
                  type="number"
                  min="16"
                  max="30"
                  value={acTemperature}
                  onChange={(e) =>
                    setAcTemperature(
                      Number(e.target.value)
                    )
                  }
                />

                <button
                  onClick={
                    changeACTemperature
                  }
                >
                  Set Temperature
                </button>

              </div>
            )}

            {/* DOOR */}

            {availableDevices[DEVICE.Door] && (
              <div className="device">

                <h2>
                  🚪 Smart Door
                </h2>

                <p>
                  Status:{" "}
                  {doorLocked
                    ? "LOCKED"
                    : "UNLOCKED"}
                </p>

                <button
                  onClick={toggleDoor}
                >
                  {doorLocked
                    ? "Unlock Door"
                    : "Lock Door"}
                </button>

              </div>
            )}

            {/* CAMERA */}

            {availableDevices[
              DEVICE.Camera
            ] && (
              <div className="device">

                <h2>
                  📷 Security Camera
                </h2>

                <p>
                  Status:{" "}
                  {camera ? "ON" : "OFF"}
                </p>

                <button
                  onClick={toggleCamera}
                >
                  {camera
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

              </div>
            )}

            {/* THERMOSTAT */}

            {availableDevices[
              DEVICE.Thermostat
            ] && (
              <div className="device">

                <h2>
                  🌡️ Room Thermostat
                </h2>

                <p>
                  Temperature:{" "}
                  {thermostatTemperature}°C
                </p>

                <input
                  type="number"
                  min="16"
                  max="30"
                  value={
                    thermostatTemperature
                  }
                  onChange={(e) =>
                    setThermostatTemperature(
                      Number(e.target.value)
                    )
                  }
                />

                <button
                  onClick={
                    changeThermostatTemperature
                  }
                >
                  Set Temperature
                </button>

              </div>
            )}

            {/* WINDOW */}

            {availableDevices[
              DEVICE.Window
            ] && (
              <div className="device">

                <h2>
                  🪟 Smart Window
                </h2>

                <p>
                  Status:{" "}
                  {windowOpen
                    ? "OPEN"
                    : "CLOSED"}
                </p>

                <button
                  onClick={toggleWindow}
                >
                  {windowOpen
                    ? "Close Window"
                    : "Open Window"}
                </button>

              </div>
            )}

            {/* ALARM */}

            {availableDevices[
              DEVICE.Alarm
            ] && (
              <div className="device">

                <h2>
                  🚨 Emergency Alarm
                </h2>

                <p>
                  Status:{" "}
                  {alarm
                    ? "ARMED"
                    : "DISARMED"}
                </p>

                <button
                  onClick={toggleAlarm}
                >
                  {alarm
                    ? "Disarm Alarm"
                    : "Arm Alarm"}
                </button>

              </div>
            )}

            {/* PATIENT TV */}

            {availableDevices[
              DEVICE.PatientTV
            ] && (
              <div className="device">

                <h2>
                  📺 Patient TV
                </h2>

                <p>
                  Status:{" "}
                  {patientTV
                    ? "ON"
                    : "OFF"}
                </p>

                <button
                  onClick={togglePatientTV}
                >
                  {patientTV
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

                <br />

                <label>
                  Volume:

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      patientTVVolume
                    }
                    onChange={(e) =>
                      setPatientTVVolume(
                        Number(e.target.value)
                      )
                    }
                  />
                </label>

                <button
                  onClick={
                    changePatientTVVolume
                  }
                >
                  Set Volume
                </button>

              </div>
            )}

            {/* NURSE CALL */}

            {availableDevices[
              DEVICE.NurseCall
            ] && (
              <div className="device">

                <h2>
                  🔔 Nurse Call
                </h2>

                <p>
                  Status:{" "}
                  {nurseCall
                    ? "ACTIVE"
                    : "INACTIVE"}
                </p>

                <button
                  onClick={
                    toggleNurseCall
                  }
                >
                  {nurseCall
                    ? "Reset Nurse Call"
                    : "Call Nurse"}
                </button>

              </div>
            )}

            {/* PATIENT BED */}

            {availableDevices[
              DEVICE.PatientBed
            ] && (
              <div className="device">

                <h2>
                  🛏️ Patient Bed
                </h2>

                <p>
                  Position:{" "}
                  {patientBedRaised
                    ? "RAISED"
                    : "LOWERED"}
                </p>

                <button
                  onClick={
                    togglePatientBed
                  }
                >
                  {patientBedRaised
                    ? "Lower Bed"
                    : "Raise Bed"}
                </button>

              </div>
            )}

            {/* BEDSIDE LAMP */}

            {availableDevices[
              DEVICE.BedsideLamp
            ] && (
              <div className="device">

                <h2>
                  🔆 Bedside Lamp
                </h2>

                <p>
                  Status:{" "}
                  {bedsideLamp
                    ? "ON"
                    : "OFF"}
                </p>

                <button
                  onClick={
                    toggleBedsideLamp
                  }
                >
                  {bedsideLamp
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

              </div>
            )}

            {/* EXHAUST FAN */}

            {availableDevices[
              DEVICE.ExhaustFan
            ] && (
              <div className="device">

                <h2>
                  💨 Exhaust Fan
                </h2>

                <p>
                  Status:{" "}
                  {exhaustFan
                    ? "ON"
                    : "OFF"}
                </p>

                <button
                  onClick={
                    toggleExhaustFan
                  }
                >
                  {exhaustFan
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

              </div>
            )}

            {/* ROOM MONITOR */}

            {availableDevices[
              DEVICE.RoomMonitor
            ] && (
              <div className="device">

                <h2>
                  🖥️ Room Monitor
                </h2>

                <p>
                  Status:{" "}
                  {roomMonitor
                    ? "ACTIVE"
                    : "INACTIVE"}
                </p>

                <button
                  onClick={
                    toggleRoomMonitor
                  }
                >
                  {roomMonitor
                    ? "Turn OFF"
                    : "Turn ON"}
                </button>

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default App;