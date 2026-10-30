"use strict";

const vscode = require("vscode");

const API_URL = "https://docs.railroadergame.com/modding/relay-api/";

const RELAY_NAMESPACES = {
  railroader: {
    description: "The Railroader game API module. Import world or ui to access game features.",
    documentation: `${API_URL}railroader/`,
  },
  world: {
    description: "Access the game world, including cars, game time, track, and operations.",
    documentation: `${API_URL}railroader/world/`,
  },
  "world.track": {
    description: "Work with track locations, segments, and switches.",
    documentation: `${API_URL}railroader/track/`,
  },
  "world.ops": {
    description: "Access freight operations, industries, and waybills.",
    documentation: `${API_URL}railroader/ops/`,
  },
  ui: {
    description: "Extend the Railroader UI and register console commands.",
    documentation: `${API_URL}railroader/ui-commands/`,
  },
  json: {
    description: "Read JSON data from files available to the current script.",
    documentation: `${API_URL}json/`,
  },
  math: {
    description: "Mathematical functions and utilities for Relay scripts.",
    documentation: `${API_URL}math/`,
  },
  log: {
    description: "Write diagnostic information to the Railroader log.",
    documentation: `${API_URL}log/`,
  },
  context: {
    description: "The definition modification context used by Data.rl scripts.",
    documentation: "https://docs.railroadergame.com/modding/data-rl/",
  },
};

function provideNamespaceHover(document, position) {
  const range = document.getWordRangeAtPosition(position, /[A-Za-z_]\w*/);

  if (range == null) {
    return undefined;
  }

  const name = document.getText(range);
  const before = document.lineAt(position.line).text.substring(0, range.start.character);
  let namespaceName = name;

  if (before.endsWith(".")) {
    if (!/\bworld\.$/.test(before)) {
      return undefined;
    }

    namespaceName = `world.${name}`;
  }

  const definition = RELAY_NAMESPACES[namespaceName];

  if (definition == null) {
    return undefined;
  }

  const markdown = new vscode.MarkdownString(
    `**${namespaceName}** (namespace)\n\n${definition.description}\n\n[Documentation](${definition.documentation})`
  );

  return new vscode.Hover(markdown, range);
}

module.exports = provideNamespaceHover;
