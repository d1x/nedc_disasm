/** @type {number} start program address */
const START_ADDR = 0x100;

const OPCODE_TABLE = {
  0x0: 'nop'
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
      let curr = queue.shift();
      this.map[this.addr] = OPCODE_TABLE[curr];
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