"use strict";

const vscode = require("vscode");
const RELAY_API = require("./relayApi");
const provideNamespaceHover = require("./relayNamespaces");

const MEMBER_PATTERN =
  /\b(world(?:\.track|\.ops)?|ui|json|context|log)\.([A-Za-z_]\w*)?/g;

function getMemberAtPosition(line, position) {
  MEMBER_PATTERN.lastIndex = 0;

  let match;

  while ((match = MEMBER_PATTERN.exec(line)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (position < start || position > end) {
      continue;
    }

    return {
      owner: match[1],
      member: match[2] || "",
      start: start,
      end: end,
    };
  }

  return null;
}

function provideCompletionItems(document, position) {
  const line = document.lineAt(position.line).text;
  const member = getMemberAtPosition(line, position.character);

  if (member == null || RELAY_API[member.owner] == null) {
    return undefined;
  }

  const api = RELAY_API[member.owner];
  const start = member.start + member.owner.length + 1;
  const replacement = new vscode.Range(
    position.line,
    start,
    position.line,
    member.end
  );
  const completions = [];

  for (const [name, definition] of Object.entries(api)) {
    const kind =
      definition.type === "property"
        ? vscode.CompletionItemKind.Property
        : vscode.CompletionItemKind.Method;

    const completion = new vscode.CompletionItem(name, kind);

    completion.detail = definition.description;
    completion.documentation = new vscode.MarkdownString(
      `${definition.description}\n\n[Railroader documentation](${definition.documentation})`
    );
    completion.range = replacement;
    completion.filterText = name;

    if (definition.snippet != null) {
      completion.insertText = new vscode.SnippetString(definition.snippet);
    }

    completions.push(completion);
  }

  return completions;
}

function provideHover(document, position) {
  const namespaceHover = provideNamespaceHover(document, position);

  if (namespaceHover != null) {
    return namespaceHover;
  }

  const line = document.lineAt(position.line).text;
  const member = getMemberAtPosition(line, position.character);

  if (member == null || RELAY_API[member.owner] == null) {
    return undefined;
  }

  const definition = RELAY_API[member.owner][member.member];

  if (definition == null) {
    return undefined;
  }

  const markdown = new vscode.MarkdownString(
    `**${member.owner}.${member.member}** (${definition.type})\n\n` +
      `${definition.description}\n\n[Documentation](${definition.documentation})`
  );

  const start = member.start + member.owner.length + 1;
  const range = new vscode.Range(
    position.line,
    start,
    position.line,
    start + member.member.length
  );

  return new vscode.Hover(markdown, range);
}

function activate(context) {
  const language = {
    language: "railroader-relay",
    scheme: "file",
  };

  const completions = vscode.languages.registerCompletionItemProvider(
    language,
    { provideCompletionItems },
    "."
  );

  const hovers = vscode.languages.registerHoverProvider(language, {
    provideHover,
  });

  context.subscriptions.push(completions, hovers);
}

function deactivate() {}

module.exports = { activate, deactivate };
