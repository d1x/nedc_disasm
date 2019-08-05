# e-Reader Dot Code Disassembler

Disassembles e-Reader z80 binaries into human readable code (assembly).

## Convert card RAW to z80 binary

Prerequisites: download `nedcenc.exe` and `nevpk.exe` from [caitsith2's site](https://www.caitsith2.com/ereader/devtools.htm).

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

## Disassemble z80 binary

Prerequisites: Download Node.js 11.0.0 or a later release.

1. Build
   ```
   npm run-script build
   ```
1. Disassemble 
   ```
   npm start -- -i card.z80
   ```
This command outputs `main.asm` and multiple include files.

## Build disassembled code back to RAW

Prerequisites: download [SDCC](http://sdcc.sourceforge.net) and `nedcmake.exe` from [caitsith2's site](https://www.caitsith2.com/ereader/devtools.htm).

1. Build
   ```
   sdasz80.exe -l -o -s -p main.o main.asm
   ```
1. Link
   ```
   sdldz80.exe -n -- -i main.ihx main.o
   ```
1. Make binary
   ```
   makebin.exe -p < main.ihx > main.z80
   ```
1. Remove first 256 bytes (0x100) from `main.z80`
1. Generate `RAW`
   
   Indicate `-region 0` for Japanese e-Reader, `-region 1` for US e-Reader, `-region 2` for Japanese e-Reader+.
   ```
   nedcmake.exe -i main.z80 -type 1 -region 1
   ```
