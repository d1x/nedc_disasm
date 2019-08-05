# e-Reader Dot Code Disassembler

Disassembles e-Reader z80 binaries into human readable code (assembly).

## Prerequisites

Download `nedcenc.exe` and `nevpk.exe` from [caitsith2's site](https://www.caitsith2.com/ereader/devtools.htm).

To extract the z80 binary from a card's `RAW`:

1. Decode `RAW`
    ```
    nedcenc.exe -d -i card.raw -o card.bin
    ```
1. Remove header (first 116 bytes) from `card.bin` using your preferred hex editor. `card.bin` first bytes should be:
   ```
   76 70 6b 30 (vpk0)
   ```
1. Decode vpk
   ```
   nevpk.exe -d -i card.bin -o card.z80
   ```

## How to disassemble

Download Node.js 11.0.0 or a later release.

1. Build
   ```
   npm run-script build
   ```
1. Disassemble 
   ```
   npm start -- -i card.z80
   ```
This command outputs `main.asm` and multiple include files.