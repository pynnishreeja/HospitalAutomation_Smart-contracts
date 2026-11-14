# Hospital Room Automation Using Blockchain Smart Contracts

A blockchain-based hospital room automation and access-control system that allows users to manage room-specific devices through a web interface. Solidity smart contracts handle device states, room configurations, and user permissions.

## Overview

Hospitals contain different types of rooms, such as General Wards, Intensive Care Units (ICUs), and Operation Theatres. Each room has different equipment and automation requirements.

This project provides a centralized web interface for interacting with room-specific devices while using blockchain smart contracts to enforce access permissions.

**Note:** This is currently a software prototype. Device operations are simulated through smart contract states. Physical IoT hardware integration is planned as future work.

## Key Features

- **Room-Based Device Management:** Different rooms have different sets of available devices.
- **Device Control:** Control simulated devices such as lights, fans, air conditioners, doors, cameras, and other hospital equipment.
- **Blockchain-Based Access Control:** Smart contracts verify whether users have permission to control specific devices in specific rooms.
- **Admin Management:** The administrator can add users, remove users, grant permissions, and revoke permissions.
- **MetaMask Integration:** Connect a blockchain wallet and approve transactions.
- **Live Device States:** Retrieve device states from the smart contract and display them in the frontend.

## Hospital Room Configuration

| Room Type | Room Numbers | Example Devices |
|---|---|---|
| General Ward | 101–104 | Light, Fan, AC, Door, Patient TV, Nurse Call, Patient Bed |
| ICU | 201–202 | Light, AC, Door, Camera, Thermostat, Alarm, Nurse Call, Room Monitor |
| Operation Theatre | 301–302 | Light, AC, Door, Camera, Thermostat, Alarm, Exhaust Fan |

Each room has its own device availability configuration.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, CSS |
| Blockchain | Hardhat Local Network |
| Smart Contracts | Solidity |
| Blockchain Interaction | ethers.js |
| Wallet | MetaMask |
| Development Environment | Node.js |

## System Architecture

```text
        User
         |
         v
   React Frontend
         |
         v
      ethers.js
         |
         v
      MetaMask
         |
         v
 Hardhat Local Blockchain
         |
         v
 Solidity Smart Contract
         |
         v
 Room and Device States
```

## Project Structure

```text
SmartHomeBlockchain/
|
|-- blockchain/
|   |-- contracts/
|   |   |-- SmartHome.sol
|   |-- ignition/
|   |   |-- modules/
|   |       |-- SmartHome.ts
|   |-- test/
|   |-- hardhat.config.ts
|   |-- package.json
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- main.jsx
|   |-- package.json
|
|-- README.md
```

## Installation and Setup

### Prerequisites

Install the following:

- Node.js and npm
- MetaMask browser extension
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/pynnishreeja/HospitalAutomation_Smart-contracts.git
cd HospitalAutomation_Smart-contracts
```

### 2. Set Up the Blockchain

```bash
cd blockchain
npm install
```

Compile the smart contract:

```bash
npx hardhat compile
```

### 3. Start the Local Blockchain

Open a terminal inside the `blockchain` folder:

```bash
npx hardhat node
```

Keep this terminal running.

### 4. Deploy the Smart Contract

Open another terminal in the `blockchain` folder:

```bash
npx hardhat ignition deploy ignition/modules/SmartHome.ts --network localhost --reset
```

Copy the deployed contract address and ensure the frontend uses the same address.

### 5. Configure MetaMask

Add a custom network in MetaMask:

- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

Import a test account provided by Hardhat for local development.

### 6. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173/
```

Connect MetaMask to interact with the application.

## How It Works

1. The user connects their MetaMask wallet.
2. The user selects a hospital room.
3. The frontend retrieves the devices available in that room.
4. The user selects a device and requests an operation.
5. MetaMask asks the user to approve the transaction.
6. The smart contract checks device availability and user permissions.
7. If authorized, the smart contract updates the device state.
8. The updated state is retrieved and displayed in the frontend.

## Future Enhancements

- Integrate ESP32 and physical IoT devices.
- Connect smart contract commands to real hospital equipment.
- Introduce role-based access for doctors, nurses, and administrators.
- Add event logging and monitoring dashboards.
- Improve device monitoring and emergency alert functionality.

## Project Status

Software prototype with React frontend, Solidity smart contracts, MetaMask integration, and a Hardhat local blockchain.

## Author

**Shreeja Pynni**

