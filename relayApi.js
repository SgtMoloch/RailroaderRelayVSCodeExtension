"use strict";

const DOCUMENTATION_URL = "https://docs.railroadergame.com/modding/";

const DOCUMENTATION_PATHS = {
  world: "relay-api/railroader/world/",
  track: "relay-api/railroader/track/",
  ops: "relay-api/railroader/ops/",
  commands: "relay-api/railroader/ui-commands/",
  ui: "relay-api/railroader/ui-extending/",
  json: "relay-api/json/",
  definitions: "data-rl/",
  log: "relay-api/log/",
};

function property(description, documentation) {
  return {
    type: "property",
    description: description,
    documentation: DOCUMENTATION_URL + documentation,
  };
}

function method(description, documentation, snippet = null) {
  return {
    type: "method",
    description: description,
    documentation: DOCUMENTATION_URL + documentation,
    snippet: snippet,
  };
}

// Keep the API definitions separate from the completion and hover logic.
// These are documented methods only, not a complete list of the game's API.
const RELAY_API = {
  world: {
    isHost: property(
      "Whether this game instance is the authoritative host.",
      DOCUMENTATION_PATHS.world
    ),
    frameTime: property("Current Unity frame time.", DOCUMENTATION_PATHS.world),
    gameTime: property("Game time in seconds.", DOCUMENTATION_PATHS.world),
    isWaiting: property(
      "Whether host fast-forward is active.",
      DOCUMENTATION_PATHS.world
    ),
    ops: property("Freight operations API.", DOCUMENTATION_PATHS.ops),
    track: property("Track and locations API.", DOCUMENTATION_PATHS.track),
    getSelectedCar: method(
      "Returns the selected Car or null.",
      DOCUMENTATION_PATHS.world,
      "getSelectedCar()"
    ),
    getInspectorCar: method(
      "Returns the inspected Car or null.",
      DOCUMENTATION_PATHS.world,
      "getInspectorCar()"
    ),
    getCars: method(
      "Returns all cars, optionally filtered by AAR car type.",
      DOCUMENTATION_PATHS.world,
      "getCars(${1:null})"
    ),
    placeTrain: method(
      "Host-only. Spawns a consist from an array of car definition identifiers.",
      DOCUMENTATION_PATHS.world,
      'placeTrain(${1:location}, [${2:"rr/boxcar-40ft"}])'
    ),
    moveCar: method(
      "Host-only. Moves a car to a track location.",
      DOCUMENTATION_PATHS.world,
      "moveCar(${1:car}, ${2:location}, ${3:null})"
    ),
    carAtLocation: method(
      "Find a car within a radius of a track location.",
      DOCUMENTATION_PATHS.world,
      "carAtLocation(${1:location}, ${2:radius})"
    ),
    getPassengerStop: method(
      "Find a station passenger stop by ID.",
      DOCUMENTATION_PATHS.world,
      "getPassengerStop(${1:stationId})"
    ),
    getBalance: method(
      "Returns railroad account balance.",
      DOCUMENTATION_PATHS.world,
      "getBalance()"
    ),
    startWaitGameHours: method(
      "Host-only. Starts fast-forward for the given number of hours.",
      DOCUMENTATION_PATHS.world,
      "startWaitGameHours(${1:hours})"
    ),
    say: method(
      "Broadcast a chat message to all players.",
      DOCUMENTATION_PATHS.world,
      "say(${1:message})"
    ),
    getPropertyObject: method(
      "Find a registered property object by ID.",
      DOCUMENTATION_PATHS.world,
      "getPropertyObject(${1:objectId})"
    ),
  },
  "world.track": {
    getMarkerLocation: method(
      "Find a track Location from a marker ID; null when absent.",
      DOCUMENTATION_PATHS.track,
      'getMarkerLocation("${1:yard-lead}")'
    ),
    locationByMoving: method(
      "Find a Location offset by a distance along the track in meters.",
      DOCUMENTATION_PATHS.track,
      "locationByMoving(${1:location}, ${2:distance}, ${3:false}, ${4:false})"
    ),
    checkSameRoute: method(
      "Check whether two track locations share a route within a maximum distance.",
      DOCUMENTATION_PATHS.track,
      "checkSameRoute(${1:a}, ${2:b}, ${3:limit})"
    ),
    getDistance: method(
      "Track distance between two Locations in meters.",
      DOCUMENTATION_PATHS.track,
      "getDistance(${1:a}, ${2:b})"
    ),
    getSegment: method(
      "Find a track segment by ID.",
      DOCUMENTATION_PATHS.track,
      "getSegment(${1:segmentId})"
    ),
    getSwitchThrown: method(
      "Read a switch's thrown/reversed state.",
      DOCUMENTATION_PATHS.track,
      "getSwitchThrown(${1:switchId})"
    ),
    setSwitchThrown: method(
      "Host-only. Set the thrown/reversed state of a switch.",
      DOCUMENTATION_PATHS.track,
      "setSwitchThrown(${1:switchId}, ${2:true})"
    ),
  },
  "world.ops": {
    getIndustry: method(
      "Look up an industry by identifier.",
      DOCUMENTATION_PATHS.ops,
      "getIndustry(${1:industryId})"
    ),
    getAllIndustryIds: method(
      "Return identifiers for all map industries.",
      DOCUMENTATION_PATHS.ops,
      "getAllIndustryIds()"
    ),
    getAllInterchangeIds: method(
      "Return identifiers for all interchanges.",
      DOCUMENTATION_PATHS.ops,
      "getAllInterchangeIds()"
    ),
    getNextInterchangeServeTime: method(
      "In-game time of next interchange service, in seconds since day zero.",
      DOCUMENTATION_PATHS.ops,
      "getNextInterchangeServeTime()"
    ),
    getCarsAtInterchange: method(
      "Cars currently standing at any interchange.",
      DOCUMENTATION_PATHS.ops,
      "getCarsAtInterchange()"
    ),
    getCarsAtIndustry: method(
      "Cars currently standing at a named industry.",
      DOCUMENTATION_PATHS.ops,
      "getCarsAtIndustry(${1:industryId})"
    ),
    setIndustryRandomSeed: method(
      "Set a deterministic random seed for industry testing.",
      DOCUMENTATION_PATHS.ops,
      "setIndustryRandomSeed(${1:industryId}, ${2:seed})"
    ),
    setInterchangeEnabled: method(
      "Enable or disable an interchange.",
      DOCUMENTATION_PATHS.ops,
      "setInterchangeEnabled(${1:interchangeId}, ${2:true})"
    ),
    sweep: method(
      "Run a freight operations sweep now.",
      DOCUMENTATION_PATHS.ops,
      "sweep()"
    ),
  },
  ui: {
    registerCommand: method(
      "Registers an in-game console slash command. Use from onWorldLoad(ctx).",
      DOCUMENTATION_PATHS.commands,
      'registerCommand("/${1:command}", "${2:Description}", (${3:args}) => {\n    $0\n})'
    ),
    extend: method(
      "Extend a Railroader UI panel.",
      DOCUMENTATION_PATHS.ui,
      "extend(${1:panelId})"
    ),
  },
  json: {
    load: method(
      "Read JSON within the current asset pack. Assert the resulting runtime type if needed.",
      DOCUMENTATION_PATHS.json,
      'load("${1:Definitions.json}")'
    ),
  },
  context: {
    modify: method(
      "Modify an existing definition in Data.rl.",
      DOCUMENTATION_PATHS.definitions,
      'modify("${1:identifier}", (${2:obj}) => {\n    $0\n})'
    ),
    merge: method(
      "Deep-merge an RFC 7396 patch into a definition.",
      DOCUMENTATION_PATHS.definitions,
      'merge("${1:identifier}", ${2:patch})'
    ),
    modifyAs: method(
      "Clone and modify a definition as a new identifier.",
      DOCUMENTATION_PATHS.definitions
    ),
    replace: method("Replace a definition.", DOCUMENTATION_PATHS.definitions),
    remove: method("Remove a definition.", DOCUMENTATION_PATHS.definitions),
  },
  log: {
    debug: method(
      "Write a debug log entry.",
      DOCUMENTATION_PATHS.log,
      "debug(${1:message})"
    ),
    info: method(
      "Write an info log entry.",
      DOCUMENTATION_PATHS.log,
      "info(${1:message})"
    ),
    warning: method(
      "Write a warning log entry.",
      DOCUMENTATION_PATHS.log,
      "warning(${1:message})"
    ),
    error: method(
      "Write an error log entry.",
      DOCUMENTATION_PATHS.log,
      "error(${1:message})"
    ),
  },
};

module.exports = RELAY_API;
