// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SmartHome {

    // =========================================================
    // 1. ADMIN
    // =========================================================

    address public admin;


    // =========================================================
    // 2. HOSPITAL DEVICES
    // =========================================================

    enum Device {
        Light,              // 0
        Fan,                // 1
        AirConditioner,     // 2
        Door,               // 3
        Camera,             // 4
        Thermostat,         // 5
        Window,             // 6
        Alarm,              // 7
        PatientTV,          // 8
        NurseCall,          // 9
        PatientBed,         // 10
        BedsideLamp,        // 11
        ExhaustFan,         // 12
        RoomMonitor         // 13
    }


    // =========================================================
    // 3. DEVICE STATE
    // =========================================================

    struct DeviceState {
        bool active;
        uint256 value;
    }

    // Room Number => Device => Device State
    mapping(uint256 => mapping(Device => DeviceState))
        private deviceStates;

    // Room Number => Device => Is Device Available
    mapping(uint256 => mapping(Device => bool))
        public roomDevices;


    // =========================================================
    // 4. USERS
    // =========================================================

    mapping(address => bool) public authorizedUsers;


    // =========================================================
    // 5. ROOM + DEVICE PERMISSIONS
    // =========================================================

    // User => Room Number => Device => Permission
    mapping(
        address => mapping(uint256 => mapping(Device => bool))
    ) private permissions;


    // =========================================================
    // 6. EVENTS
    // =========================================================

    event UserAdded(address indexed user);

    event UserRemoved(address indexed user);

    event PermissionGranted(
        address indexed user,
        uint256 roomNumber,
        Device device
    );

    event PermissionRevoked(
        address indexed user,
        uint256 roomNumber,
        Device device
    );

    event DeviceAction(
        address indexed user,
        uint256 roomNumber,
        Device device,
        string action
    );


    // =========================================================
    // 7. CONSTRUCTOR
    // =========================================================

    constructor() {

        admin = msg.sender;

        // General Ward
        setupGeneralWardRoom(101);
        setupGeneralWardRoom(102);
        setupGeneralWardRoom(103);
        setupGeneralWardRoom(104);

        // ICU
        setupICURoom(201);
        setupICURoom(202);

        // Operation Theatre
        setupOperationRoom(301);
        setupOperationRoom(302);
    }


    // =========================================================
    // 8. GENERAL WARD ROOM
    // =========================================================

    function setupGeneralWardRoom(uint256 roomNumber)
        internal
    {
        // Light
        roomDevices[roomNumber][Device.Light] = true;
        deviceStates[roomNumber][Device.Light] =
            DeviceState(false, 0);

        // Fan
        roomDevices[roomNumber][Device.Fan] = true;
        deviceStates[roomNumber][Device.Fan] =
            DeviceState(false, 1);

        // Air Conditioner
        roomDevices[roomNumber][Device.AirConditioner] = true;
        deviceStates[roomNumber][Device.AirConditioner] =
            DeviceState(false, 24);

        // Door
        roomDevices[roomNumber][Device.Door] = true;
        deviceStates[roomNumber][Device.Door] =
            DeviceState(false, 1);

        // Patient TV
        roomDevices[roomNumber][Device.PatientTV] = true;
        deviceStates[roomNumber][Device.PatientTV] =
            DeviceState(false, 10);

        // Nurse Call
        roomDevices[roomNumber][Device.NurseCall] = true;
        deviceStates[roomNumber][Device.NurseCall] =
            DeviceState(false, 0);

        // Patient Bed
        roomDevices[roomNumber][Device.PatientBed] = true;
        deviceStates[roomNumber][Device.PatientBed] =
            DeviceState(true, 0);

        // Bedside Lamp
        roomDevices[roomNumber][Device.BedsideLamp] = true;
        deviceStates[roomNumber][Device.BedsideLamp] =
            DeviceState(false, 0);

        // Exhaust Fan
        roomDevices[roomNumber][Device.ExhaustFan] = true;
        deviceStates[roomNumber][Device.ExhaustFan] =
            DeviceState(false, 0);
    }


    // =========================================================
    // 9. ICU ROOM
    // =========================================================

    function setupICURoom(uint256 roomNumber)
        internal
    {
        // Light
        roomDevices[roomNumber][Device.Light] = true;
        deviceStates[roomNumber][Device.Light] =
            DeviceState(false, 0);

        // Air Conditioner
        roomDevices[roomNumber][Device.AirConditioner] = true;
        deviceStates[roomNumber][Device.AirConditioner] =
            DeviceState(false, 22);

        // Door
        roomDevices[roomNumber][Device.Door] = true;
        deviceStates[roomNumber][Device.Door] =
            DeviceState(false, 1);

        // Security Camera
        roomDevices[roomNumber][Device.Camera] = true;
        deviceStates[roomNumber][Device.Camera] =
            DeviceState(false, 0);

        // Thermostat
        roomDevices[roomNumber][Device.Thermostat] = true;
        deviceStates[roomNumber][Device.Thermostat] =
            DeviceState(true, 22);

        // Emergency Alarm
        roomDevices[roomNumber][Device.Alarm] = true;
        deviceStates[roomNumber][Device.Alarm] =
            DeviceState(false, 0);

        // Nurse Call
        roomDevices[roomNumber][Device.NurseCall] = true;
        deviceStates[roomNumber][Device.NurseCall] =
            DeviceState(false, 0);

        // Patient Bed
        roomDevices[roomNumber][Device.PatientBed] = true;
        deviceStates[roomNumber][Device.PatientBed] =
            DeviceState(true, 0);

        // Bedside Lamp
        roomDevices[roomNumber][Device.BedsideLamp] = true;
        deviceStates[roomNumber][Device.BedsideLamp] =
            DeviceState(false, 0);

        // Room Monitor
        roomDevices[roomNumber][Device.RoomMonitor] = true;
        deviceStates[roomNumber][Device.RoomMonitor] =
            DeviceState(true, 0);
    }


    // =========================================================
    // 10. OPERATION THEATRE
    // =========================================================

    function setupOperationRoom(uint256 roomNumber)
        internal
    {
        // Main Light
        roomDevices[roomNumber][Device.Light] = true;
        deviceStates[roomNumber][Device.Light] =
            DeviceState(false, 0);

        // Air Conditioner
        roomDevices[roomNumber][Device.AirConditioner] = true;
        deviceStates[roomNumber][Device.AirConditioner] =
            DeviceState(false, 20);

        // Controlled Door
        roomDevices[roomNumber][Device.Door] = true;
        deviceStates[roomNumber][Device.Door] =
            DeviceState(false, 1);

        // Security Camera
        roomDevices[roomNumber][Device.Camera] = true;
        deviceStates[roomNumber][Device.Camera] =
            DeviceState(false, 0);

        // Thermostat
        roomDevices[roomNumber][Device.Thermostat] = true;
        deviceStates[roomNumber][Device.Thermostat] =
            DeviceState(true, 20);

        // Emergency Alarm
        roomDevices[roomNumber][Device.Alarm] = true;
        deviceStates[roomNumber][Device.Alarm] =
            DeviceState(false, 0);

        // Exhaust Fan
        roomDevices[roomNumber][Device.ExhaustFan] = true;
        deviceStates[roomNumber][Device.ExhaustFan] =
            DeviceState(false, 0);
    }


    // =========================================================
    // 11. MODIFIERS
    // =========================================================

    modifier onlyAdmin() {

        require(
            msg.sender == admin,
            "Only admin can perform this action"
        );

        _;
    }


    modifier roomDeviceExists(
        uint256 roomNumber,
        Device device
    ) {

        require(
            roomDevices[roomNumber][device],
            "Device not available in this room"
        );

        _;
    }


    modifier hasPermission(
        uint256 roomNumber,
        Device device
    ) {

        require(
            msg.sender == admin ||
            permissions[msg.sender][roomNumber][device],
            "Access denied for this room and device"
        );

        _;
    }


    // =========================================================
    // 12. USER MANAGEMENT
    // =========================================================

    function addUser(address user)
        external
        onlyAdmin
    {
        require(
            user != address(0),
            "Invalid address"
        );

        authorizedUsers[user] = true;

        emit UserAdded(user);
    }


    function removeUser(address user)
        external
        onlyAdmin
    {
        authorizedUsers[user] = false;

        emit UserRemoved(user);
    }


    // =========================================================
    // 13. PERMISSION MANAGEMENT
    // =========================================================

    function grantPermission(
        address user,
        uint256 roomNumber,
        Device device
    )
        external
        onlyAdmin
        roomDeviceExists(roomNumber, device)
    {
        require(
            user != address(0),
            "Invalid address"
        );

        authorizedUsers[user] = true;

        permissions[user][roomNumber][device] = true;

        emit PermissionGranted(
            user,
            roomNumber,
            device
        );
    }


    function revokePermission(
        address user,
        uint256 roomNumber,
        Device device
    )
        external
        onlyAdmin
    {
        permissions[user][roomNumber][device] = false;

        emit PermissionRevoked(
            user,
            roomNumber,
            device
        );
    }


    function hasDevicePermission(
        address user,
        uint256 roomNumber,
        Device device
    )
        external
        view
        returns (bool)
    {
        if (user == admin) {
            return true;
        }

        return permissions[user][roomNumber][device];
    }


    // =========================================================
    // 14. LIGHT
    // =========================================================

    function turnLightOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Light)
        hasPermission(roomNumber, Device.Light)
    {
        deviceStates[roomNumber][Device.Light].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Light,
            "Light ON"
        );
    }


    function turnLightOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Light)
        hasPermission(roomNumber, Device.Light)
    {
        deviceStates[roomNumber][Device.Light].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Light,
            "Light OFF"
        );
    }


    // =========================================================
    // 15. FAN
    // =========================================================

    function turnFanOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Fan)
        hasPermission(roomNumber, Device.Fan)
    {
        deviceStates[roomNumber][Device.Fan].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Fan,
            "Fan ON"
        );
    }


    function turnFanOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Fan)
        hasPermission(roomNumber, Device.Fan)
    {
        deviceStates[roomNumber][Device.Fan].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Fan,
            "Fan OFF"
        );
    }


    function setFanSpeed(
        uint256 roomNumber,
        uint256 speed
    )
        external
        roomDeviceExists(roomNumber, Device.Fan)
        hasPermission(roomNumber, Device.Fan)
    {
        require(
            speed >= 1 && speed <= 5,
            "Fan speed must be between 1 and 5"
        );

        deviceStates[roomNumber][Device.Fan].value = speed;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Fan,
            "Fan speed changed"
        );
    }


    // =========================================================
    // 16. AIR CONDITIONER
    // =========================================================

    function turnACOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.AirConditioner)
        hasPermission(roomNumber, Device.AirConditioner)
    {
        deviceStates[roomNumber][Device.AirConditioner].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.AirConditioner,
            "AC ON"
        );
    }


    function turnACOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.AirConditioner)
        hasPermission(roomNumber, Device.AirConditioner)
    {
        deviceStates[roomNumber][Device.AirConditioner].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.AirConditioner,
            "AC OFF"
        );
    }


    function setACTemperature(
        uint256 roomNumber,
        uint256 temperature
    )
        external
        roomDeviceExists(roomNumber, Device.AirConditioner)
        hasPermission(roomNumber, Device.AirConditioner)
    {
        require(
            temperature >= 16 && temperature <= 30,
            "Temperature must be between 16 and 30"
        );

        deviceStates[roomNumber][Device.AirConditioner].value =
            temperature;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.AirConditioner,
            "AC temperature changed"
        );
    }


    // =========================================================
    // 17. DOOR
    // =========================================================

    function unlockDoor(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Door)
        hasPermission(roomNumber, Device.Door)
    {
        deviceStates[roomNumber][Device.Door].value = 0;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Door,
            "Door UNLOCKED"
        );
    }


    function lockDoor(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Door)
        hasPermission(roomNumber, Device.Door)
    {
        deviceStates[roomNumber][Device.Door].value = 1;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Door,
            "Door LOCKED"
        );
    }


    // =========================================================
    // 18. SECURITY CAMERA
    // =========================================================

    function turnCameraOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Camera)
        hasPermission(roomNumber, Device.Camera)
    {
        deviceStates[roomNumber][Device.Camera].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Camera,
            "Camera ON"
        );
    }


    function turnCameraOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Camera)
        hasPermission(roomNumber, Device.Camera)
    {
        deviceStates[roomNumber][Device.Camera].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Camera,
            "Camera OFF"
        );
    }


    // =========================================================
    // 19. THERMOSTAT
    // =========================================================

    function setThermostatTemperature(
        uint256 roomNumber,
        uint256 temperature
    )
        external
        roomDeviceExists(roomNumber, Device.Thermostat)
        hasPermission(roomNumber, Device.Thermostat)
    {
        require(
            temperature >= 16 && temperature <= 30,
            "Temperature must be between 16 and 30"
        );

        deviceStates[roomNumber][Device.Thermostat].value =
            temperature;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Thermostat,
            "Thermostat temperature changed"
        );
    }


    // =========================================================
    // 20. SMART WINDOW
    // =========================================================

    function openWindow(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Window)
        hasPermission(roomNumber, Device.Window)
    {
        deviceStates[roomNumber][Device.Window].value = 1;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Window,
            "Window OPENED"
        );
    }


    function closeWindow(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Window)
        hasPermission(roomNumber, Device.Window)
    {
        deviceStates[roomNumber][Device.Window].value = 0;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Window,
            "Window CLOSED"
        );
    }


    // =========================================================
    // 21. SECURITY ALARM
    // =========================================================

    function armAlarm(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Alarm)
        hasPermission(roomNumber, Device.Alarm)
    {
        deviceStates[roomNumber][Device.Alarm].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Alarm,
            "Alarm ARMED"
        );
    }


    function disarmAlarm(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.Alarm)
        hasPermission(roomNumber, Device.Alarm)
    {
        deviceStates[roomNumber][Device.Alarm].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.Alarm,
            "Alarm DISARMED"
        );
    }


    // =========================================================
    // 22. PATIENT TV
    // =========================================================

    function turnPatientTVOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.PatientTV)
        hasPermission(roomNumber, Device.PatientTV)
    {
        deviceStates[roomNumber][Device.PatientTV].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.PatientTV,
            "Patient TV ON"
        );
    }


    function turnPatientTVOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.PatientTV)
        hasPermission(roomNumber, Device.PatientTV)
    {
        deviceStates[roomNumber][Device.PatientTV].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.PatientTV,
            "Patient TV OFF"
        );
    }


    function setPatientTVVolume(
        uint256 roomNumber,
        uint256 volume
    )
        external
        roomDeviceExists(roomNumber, Device.PatientTV)
        hasPermission(roomNumber, Device.PatientTV)
    {
        require(
            volume <= 100,
            "Volume must be between 0 and 100"
        );

        deviceStates[roomNumber][Device.PatientTV].value = volume;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.PatientTV,
            "Patient TV volume changed"
        );
    }


    // =========================================================
    // 23. NURSE CALL
    // =========================================================

    function activateNurseCall(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.NurseCall)
        hasPermission(roomNumber, Device.NurseCall)
    {
        deviceStates[roomNumber][Device.NurseCall].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.NurseCall,
            "Nurse Call ACTIVATED"
        );
    }


    function resetNurseCall(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.NurseCall)
        hasPermission(roomNumber, Device.NurseCall)
    {
        deviceStates[roomNumber][Device.NurseCall].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.NurseCall,
            "Nurse Call RESET"
        );
    }


    // =========================================================
    // 24. PATIENT BED
    // =========================================================

    function raisePatientBed(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.PatientBed)
        hasPermission(roomNumber, Device.PatientBed)
    {
        deviceStates[roomNumber][Device.PatientBed].value = 1;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.PatientBed,
            "Patient Bed RAISED"
        );
    }


    function lowerPatientBed(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.PatientBed)
        hasPermission(roomNumber, Device.PatientBed)
    {
        deviceStates[roomNumber][Device.PatientBed].value = 0;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.PatientBed,
            "Patient Bed LOWERED"
        );
    }


    // =========================================================
    // 25. BEDSIDE LAMP
    // =========================================================

    function turnBedsideLampOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.BedsideLamp)
        hasPermission(roomNumber, Device.BedsideLamp)
    {
        deviceStates[roomNumber][Device.BedsideLamp].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.BedsideLamp,
            "Bedside Lamp ON"
        );
    }


    function turnBedsideLampOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.BedsideLamp)
        hasPermission(roomNumber, Device.BedsideLamp)
    {
        deviceStates[roomNumber][Device.BedsideLamp].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.BedsideLamp,
            "Bedside Lamp OFF"
        );
    }


    // =========================================================
    // 26. EXHAUST FAN
    // =========================================================

    function turnExhaustFanOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.ExhaustFan)
        hasPermission(roomNumber, Device.ExhaustFan)
    {
        deviceStates[roomNumber][Device.ExhaustFan].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.ExhaustFan,
            "Exhaust Fan ON"
        );
    }


    function turnExhaustFanOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.ExhaustFan)
        hasPermission(roomNumber, Device.ExhaustFan)
    {
        deviceStates[roomNumber][Device.ExhaustFan].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.ExhaustFan,
            "Exhaust Fan OFF"
        );
    }


    // =========================================================
    // 27. ROOM MONITOR
    // =========================================================

    function turnRoomMonitorOn(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.RoomMonitor)
        hasPermission(roomNumber, Device.RoomMonitor)
    {
        deviceStates[roomNumber][Device.RoomMonitor].active = true;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.RoomMonitor,
            "Room Monitor ON"
        );
    }


    function turnRoomMonitorOff(uint256 roomNumber)
        external
        roomDeviceExists(roomNumber, Device.RoomMonitor)
        hasPermission(roomNumber, Device.RoomMonitor)
    {
        deviceStates[roomNumber][Device.RoomMonitor].active = false;

        emit DeviceAction(
            msg.sender,
            roomNumber,
            Device.RoomMonitor,
            "Room Monitor OFF"
        );
    }


    // =========================================================
    // 28. GET DEVICE STATE
    // =========================================================

    function getDeviceState(
        uint256 roomNumber,
        Device device
    )
        external
        view
        returns (
            bool active,
            uint256 value
        )
    {
        require(
            roomDevices[roomNumber][device],
            "Device not available in this room"
        );

        DeviceState memory state =
            deviceStates[roomNumber][device];

        return (
            state.active,
            state.value
        );
    }


    // =========================================================
    // 29. CHECK WHETHER DEVICE EXISTS IN ROOM
    // =========================================================

    function isDeviceAvailable(
        uint256 roomNumber,
        Device device
    )
        external
        view
        returns (bool)
    {
        return roomDevices[roomNumber][device];
    }


    // =========================================================
    // 30. GET ADMIN
    // =========================================================

    function getAdmin()
        external
        view
        returns (address)
    {
        return admin;
    }
}