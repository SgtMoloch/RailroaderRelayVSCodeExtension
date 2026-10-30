# Railroader Relay — VS Code support (unofficial)

**An experimental, community/unofficial extension for Railroader's `.rl` scripting language.** Not affiliated with Giraffe Lab or the game developers.

## Features

- Recognizes `.rl` files as **Railroader Relay**.
- TextMate syntax highlighting for comments, declarations, functions, classes, enums, strings (including `\(interpolation)`), numeric literals, operators, control flow, types and module imports.
- Editor bracket matching, quote pairing, indentation and folding.
- Relay-specific snippets: `rlmain`, `rldata`, `rlcommand`, `rlhost`, `rljsonarray`, `func`, `if`, `ifelse`, `for`, `fori`, `try`, `switch`, `closure`, `rlimport` and more.
- Curated completions and hover help for documented APIs such as `world.placeTrain`, `world.getSelectedCar`, `ui.registerCommand`, `json.load` and `context.modify`.

**No real-time compiler diagnostics, type checking, or semantic IntelliSense yet.** The official game embeds the Relay parser, and this extension does not implement it. The completions are intentionally a *partial* list; unknown methods aren't necessarily invalid.

## Installation

### Install the VSIX

1. Open VS Code.
2. Open **Extensions** (`Ctrl+Shift+X`).
3. Open the `...` menu and choose **Install from VSIX...**.
4. Select `RailroaderRelay-0.1.0.vsix`, then reload VS Code if prompted.

### Install manually (if VSIX fails)

Copy this source directory to:

`%USERPROFILE%\.vscode\extensions\local-community.railroader-relay-0.1.0`

and restart VS Code.

## Use

Open a `Main.rl` or `Data.rl` file. The bottom-right language mode should show `Railroader Relay`.

Try typing `rlmain` and accepting the snippet. Or type `world.` and use Ctrl+Space to see documented functions.

## Documentation

- [Relay language](https://docs.railroadergame.com/modding/relay/)
- [Relay API](https://docs.railroadergame.com/modding/relay-api/)
- [Main.rl](https://docs.railroadergame.com/modding/main-rl/)
- [Data.rl](https://docs.railroadergame.com/modding/data-rl/)

## Limitations

- Designed from the public Relay documentation as of October 2026, not tested against a running instance of Railroader.
- Syntax highlighting is lexical, not a full parser. Some complex nested string interpolation may be imperfect.
- Autocomplete does not infer types; it only offers a curated selection of functions when you type a known prefix.
- Updates to the game API require updates to this extension.
