/** @type {number} start program address */
const START_ADDR = 0x100;

const OPCODE_TABLE = {
  0x00: {mnemonic: 'nop', size: 1},
  0x03: {mnemonic: 'inc bc', size: 1},
  0x04: {mnemonic: 'inc b', size: 1},
  0x05: {mnemonic: 'dec b', size: 1},
  0x08: null,
  0x09: {mnemonic: 'add hl,bc', size: 1},
  0x0b: {mnemonic: 'dec bc', size: 1},
  0x0c: {mnemonic: 'inc c', size: 1},
  0x0d: {mnemonic: 'dec c', size: 1},
  0x13: {mnemonic: 'inc de', size: 1},
  0x14: {mnemonic: 'inc d', size: 1},
  0x15: {mnemonic: 'dec d', size: 1},
  0x19: {mnemonic: 'add hl,de', size: 1},
  0x1b: {mnemonic: 'dec de', size: 1},
  0x1c: {mnemonic: 'inc e', size: 1},
  0x1d: {mnemonic: 'dec e', size: 1},
  0x23: {mnemonic: 'inc hl', size: 1},
  0x24: {mnemonic: 'inc h', size: 1},
  0x25: {mnemonic: 'dec h', size: 1},
  0x27: null,
  0x29: {mnemonic: 'add hl,hl', size: 1},
  0x2b: {mnemonic: 'dec hl', size: 1},
  0x2c: {mnemonic: 'inc l', size: 1},
  0x2d: {mnemonic: 'dec l', size: 1},
  0x33: {mnemonic: 'inc sp', size: 1},
  0x34: {mnemonic: 'inc (hl)', size: 1},
  0x35: {mnemonic: 'dec (hl)', size: 1},
  0x39: {mnemonic: 'add hl,sp', size: 1},
  0x3b: {mnemonic: 'dec sp', size: 1},
  0x3c: {mnemonic: 'inc a', size: 1},
  0x3d: {mnemonic: 'dec a', size: 1},
  0x80: {mnemonic: 'add a,b', size: 1},
  0x81: {mnemonic: 'add a,c', size: 1},
  0x82: {mnemonic: 'add a,d', size: 1},
  0x83: {mnemonic: 'add a,e', size: 1},
  0x84: {mnemonic: 'add a,h', size: 1},
  0x85: {mnemonic: 'add a,l', size: 1},
  0x86: {mnemonic: 'add a,(hl)', size: 1},
  0x87: {mnemonic: 'add a,a', size: 1},
  0xc6: {mnemonic: `add a,*`, size: 2},
  0xcb: null,
  0xd7: null,
  0xd9: null,
  0xdb: null,
  0xdd: null,
  0xdf: null,
  0xe0: null,
  0xe2: null,
  0xe4: null,
  0xe7: null,
  0xe8: null,
  0xea: null,
  0xec: null,
  0xed: null,
  0xef: null,
  0xf3: null,
  0xf4: null,
  0xf7: null,
  0xfb: null,
  0xfc: null,
  0xfd: null,
  0xff: null
};

class Disasm {

  constructor() {
    /** @type Object */
    this.input = null;
    /** @type Object<number,string> */
    this.map = {};
    /** @type number */
    this.addr = START_ADDR;
    /** @type number */
    this.nextByte = 0;
  }

  /**
   * @param {string} decimal
   * @return {string} hex address 0x00 to 0xff
   */
  static toByteString(decimal) {
    const hex = parseInt(decimal).toString(16);
    return `0x${'00'.substr(0, 2 - hex.length)}${hex}`;
  }

  /** @param {Uint8Array} uint8array */
  setUint8Array(uint8array) {
    this.input = uint8array;
  }

  /** @return {string} disassembled binary */
  disassemble() {
    if (this.input == null) return 'No input stream';

    this.reset_();
    const queue = [];
    queue.push(this.readByte_());

    while (queue.length !== 0) {
      const byte = queue.shift();
      if (OPCODE_TABLE[byte] === null) {
        return Disasm.unsupported_(byte);
      }

      const opcodeObj = OPCODE_TABLE[byte];
      let mnemonic = opcodeObj.mnemonic;
      if (opcodeObj.size === 3) {
        // TODO
      } else if (opcodeObj.size === 2) {
        mnemonic = mnemonic.replace('*',
          `#${Disasm.toByteString(`${this.readByte_()}`)}`);
      }
      this.map[this.addr] = mnemonic;

      if (this.nextByte < this.input.length) {
        queue.push(this.readByte_());
      }
    }
    return this.buildOutput_();
  }

  /** @private */
  reset_() {
    this.map = {};
    this.nextByte = 0;
    this.addr = START_ADDR;
  }

  /**
   * @return {number} next input byte
   * @private
   */
  readByte_() {
    if (this.nextByte === this.input.length) throw new Error('EOF');
    return this.input[this.nextByte++];
  }

  /**
   * @return {string} output
   * @private
   */
  buildOutput_() {
    const output = [];
    const /** Array<string> */ lines = (Object.keys(this.map));
    lines.sort();
    lines.forEach((line) =>
      output.push(`${Disasm.toAddress_(line)}    ${this.map[line]}`));
    return output.join('\n');
  }

  /**
   * @param {string} opcode
   * @private
   */
  static unsupported_(opcode) {
    return `e-Reader unsupported opcode: ${Disasm.toByteString(opcode)}`;
  }

  /**
   * @param {string} decimal
   * @return {string} hex address 0x0000 to 0xffff
   * @private
   */
  static toAddress_(decimal) {
    const hex = parseInt(decimal).toString(16);
    return `0x${'0000'.substr(0, 4 - hex.length)}${hex}`;
  }
}

module.exports = Disasm;