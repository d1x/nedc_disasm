/** @type {number} start program address */
const START_ADDR = 0x100;

const OPCODE_TABLE = {
  0x00: 'nop',
  0x03: 'inc bc',
  0x04: 'inc b',
  0x05: 'dec b',
  0x08: null,
  0x0b: 'dec bc',
  0x0c: 'inc c',
  0x0d: 'dec c',
  0x13: 'inc de',
  0x14: 'inc d',
  0x15: 'dec d',
  0x1b: 'dec de',
  0x1c: 'inc e',
  0x1d: 'dec e',
  0x23: 'inc hl',
  0x24: 'inc h',
  0x25: 'dec h',
  0x27: null,
  0x2b: 'dec hl',
  0x2c: 'inc l',
  0x2d: 'dec l',
  0x33: 'inc sp',
  0x34: 'inc (hl)',
  0x35: 'dec (hl)',
  0x3b: 'dec sp',
  0x3c: 'inc a',
  0x3d: 'dec a',
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

    const queue = [];
    let nextByte = 0;
    queue.push(this.input[nextByte]);

    while (queue.length !== 0) {
      const byte = queue.shift();
      if (OPCODE_TABLE[byte] === null) {
        return Disasm.unsupported_(byte);
      }
      this.map[this.addr] = OPCODE_TABLE[byte];
      if (++nextByte < this.input.length) {
        queue.push(this.input[nextByte]);
      }
    }
    return this.buildOutput_();
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