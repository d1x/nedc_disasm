/** @type {number} start program address */
const START_ADDR = 0x100;

const OPCODE_TABLE = {
  0x0: 'nop',
  0x08: null,
  0x27: null,
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
    lines.forEach((line) => output.push(`${Disasm.toAddress_(line)}    ${this.map[line]}`));
    return output.join('\n');
  }
}

module.exports = Disasm;