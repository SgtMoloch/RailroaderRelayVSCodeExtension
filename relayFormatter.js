"use strict";

const vscode = require("vscode");

const OPENING_BRACKETS = new Set(["{", "[", "("]);
const CLOSING_BRACKETS = {
  "}": "{",
  "]": "[",
  ")": "(",
};

function scanBrackets(line, stack, state, lineNumber) {
  for (let i = 0; i < line.length; i++) {
    if (state.inMultilineString) {
      if (line.startsWith('"""', i)) {
        state.inMultilineString = false;
        i += 2;
      }
      continue;
    }

    if (line.startsWith("//", i)) {
      break;
    }

    if (line.startsWith('"""', i)) {
      state.inMultilineString = true;
      i += 2;
      continue;
    }

    if (line[i] === '"') {
      i++;

      while (i < line.length) {
        if (line[i] === "\\") {
          i += 2;
          continue;
        }
        if (line[i] === '"') {
          break;
        }
        i++;
      }
      continue;
    }

    const character = line[i];

    if (OPENING_BRACKETS.has(character)) {
      if (character === "{") {
        // A callback block already provides indentation for the remaining
        // call parenthesis when both were opened on the same line.
        for (const bracket of stack) {
          if (bracket.character === "(" && bracket.lineNumber === lineNumber) {
            bracket.indents = false;
          }
        }
      }
      stack.push({ character, lineNumber, indents: true });
    } else if (CLOSING_BRACKETS[character] === stack[stack.length - 1]?.character) {
      stack.pop();
    }
  }
}

function getIndentDepth(line, stack) {
  let remaining = stack.length;

  // Closing brackets at the start of a line belong to their opening level.
  for (const character of line) {
    if (remaining === 0 || CLOSING_BRACKETS[character] !== stack[remaining - 1]?.character) {
      break;
    }
    remaining--;
  }

  return stack.slice(0, remaining).filter((bracket) => bracket.indents).length;
}

function canJoinOpeningBrace(line) {
  // Only normalize recognized block headers. A standalone dictionary literal
  // or a brace following a comment should not be moved without parsing it.
  if (line.includes("//")) {
    return false;
  }

  return /^(?:(?:export|static)\s+)*(?:func|init|class|enum)\b/.test(line) ||
    /^(?:if|else|while|for|switch|try|catch|finally|get|set)\b/.test(line) ||
    /=>\s*$/.test(line);
}

function formatRelay(source, options = {}) {
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const endsWithNewline = /\r?\n$/.test(source);
  const lines = source.split(/\r?\n/);

  if (endsWithNewline) {
    lines.pop();
  }

  const tabSize = Math.max(1, options.tabSize || 4);
  const indent = options.insertSpaces === false ? "\t" : " ".repeat(tabSize);
  const stack = [];
  const state = { inMultilineString: false };
  const output = [];
  let consecutiveBlankLines = 0;
  let joinNextOpeningBrace = false;

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber];
    if (state.inMultilineString) {
      // Triple-quoted string contents are significant: leave them untouched.
      output.push(line);
      scanBrackets(line, stack, state, lineNumber);
      consecutiveBlankLines = 0;
      joinNextOpeningBrace = false;
      continue;
    }

    const content = line.trim();

    if (content.length === 0) {
      consecutiveBlankLines++;
      joinNextOpeningBrace = false;

      if (consecutiveBlankLines <= 1) {
        output.push("");
      }
      continue;
    }

    consecutiveBlankLines = 0;

    if (content === "{" && joinNextOpeningBrace) {
      output[output.length - 1] += " {";
      // Treat the opening brace as if it appeared on the header line. This
      // also preserves the existing callback indentation behavior.
      scanBrackets(content, stack, state, lineNumber - 1);
      joinNextOpeningBrace = false;
      continue;
    }

    const depth = getIndentDepth(content, stack);
    output.push(indent.repeat(depth) + content);
    scanBrackets(content, stack, state, lineNumber);
    joinNextOpeningBrace = !state.inMultilineString && canJoinOpeningBrace(content);
  }

  // Keep a single final newline if the file already had one.
  while (output.length > 0 && output[output.length - 1] === "") {
    output.pop();
  }

  return output.join(newline) + (endsWithNewline ? newline : "");
}

function provideDocumentFormattingEdits(document, options) {
  const original = document.getText();
  const formatted = formatRelay(original, options);

  if (original === formatted) {
    return [];
  }

  // Replace only the changed span so VS Code can preserve unaffected markers.
  let start = 0;
  while (start < original.length && start < formatted.length && original[start] === formatted[start]) {
    start++;
  }

  let originalEnd = original.length;
  let formattedEnd = formatted.length;

  while (originalEnd > start && formattedEnd > start && original[originalEnd - 1] === formatted[formattedEnd - 1]) {
    originalEnd--;
    formattedEnd--;
  }

  const range = new vscode.Range(document.positionAt(start), document.positionAt(originalEnd));
  return [vscode.TextEdit.replace(range, formatted.substring(start, formattedEnd))];
}

module.exports = { provideDocumentFormattingEdits, formatRelay };
