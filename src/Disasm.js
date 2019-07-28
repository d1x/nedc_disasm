/* jshint node: true */

/** @type {number} start program address */
const START_ADDR = 0x100;

const OPCODE_TABLE = {
  0x00: {mnemonic: 'nop', size: 1,},
  0x01: {mnemonic: 'ld bc,**', size: 3,},
  0x02: {mnemonic: 'ld (bc),a', size: 1,},
  0x03: {mnemonic: 'inc bc', size: 1,},
  0x04: {mnemonic: 'inc b', size: 1,},
  0x05: {mnemonic: 'dec b', size: 1,},
  0x06: {mnemonic: 'ld b,*', size: 2,},
  0x07: {mnemonic: 'rlca', size: 1,},
  0x08: null,
  0x09: {mnemonic: 'add hl,bc', size: 1,},
  0x0a: {mnemonic: 'ld a,(bc)', size: 1,},
  0x0b: {mnemonic: 'dec bc', size: 1,},
  0x0c: {mnemonic: 'inc c', size: 1,},
  0x0d: {mnemonic: 'dec c', size: 1,},
  0x0e: {mnemonic: 'ld c,*', size: 2,},
  0x0f: {mnemonic: 'rrca', size: 1,},
  0x11: {mnemonic: 'ld de,**', size: 3,},
  0x12: {mnemonic: 'ld (de),a', size: 1,},
  0x13: {mnemonic: 'inc de', size: 1,},
  0x14: {mnemonic: 'inc d', size: 1,},
  0x15: {mnemonic: 'dec d', size: 1,},
  0x16: {mnemonic: 'ld d,*', size: 2,},
  0x17: {mnemonic: 'rla', size: 1,},
  0x19: {mnemonic: 'add hl,de', size: 1,},
  0x1a: {mnemonic: 'ld a,(de)', size: 1,},
  0x1b: {mnemonic: 'dec de', size: 1,},
  0x1c: {mnemonic: 'inc e', size: 1,},
  0x1d: {mnemonic: 'dec e', size: 1,},
  0x1e: {mnemonic: 'ld e,*', size: 2,},
  0x1f: {mnemonic: 'rra', size: 1,},
  0x21: {mnemonic: 'ld hl,**', size: 3,},
  0x22: {mnemonic: 'ld (**),hl', size: 3,},
  0x23: {mnemonic: 'inc hl', size: 1,},
  0x24: {mnemonic: 'inc h', size: 1,},
  0x25: {mnemonic: 'dec h', size: 1,},
  0x26: {mnemonic: 'ld h,*', size: 2,},
  0x27: null,
  0x29: {mnemonic: 'add hl,hl', size: 1,},
  0x2a: {mnemonic: 'ld hl,(**)', size: 3,},
  0x2b: {mnemonic: 'dec hl', size: 1,},
  0x2c: {mnemonic: 'inc l', size: 1,},
  0x2d: {mnemonic: 'dec l', size: 1,},
  0x2e: {mnemonic: 'ld l,*', size: 2,},
  0x2f: {mnemonic: 'cpl', size: 1,},
  0x31: {mnemonic: 'ld sp,**', size: 3,},
  0x32: {mnemonic: 'ld (**),a', size: 3,},
  0x33: {mnemonic: 'inc sp', size: 1,},
  0x34: {mnemonic: 'inc (hl)', size: 1,},
  0x35: {mnemonic: 'dec (hl)', size: 1,},
  0x36: {mnemonic: 'ld (hl),*', size: 2,},
  0x37: {mnemonic: 'scf', size: 1,},
  0x39: {mnemonic: 'add hl,sp', size: 1,},
  0x3a: {mnemonic: 'ld a,(**)', size: 3,},
  0x3b: {mnemonic: 'dec sp', size: 1,},
  0x3c: {mnemonic: 'inc a', size: 1,},
  0x3d: {mnemonic: 'dec a', size: 1,},
  0x3e: {mnemonic: 'ld a,*', size: 2,},
  0x3f: {mnemonic: 'ccf', size: 1,},
  0x40: {mnemonic: 'ld b,b', size: 1,},
  0x41: {mnemonic: 'ld b,c', size: 1,},
  0x42: {mnemonic: 'ld b,d', size: 1,},
  0x43: {mnemonic: 'ld b,e', size: 1,},
  0x44: {mnemonic: 'ld b,h', size: 1,},
  0x45: {mnemonic: 'ld b,l', size: 1,},
  0x46: {mnemonic: 'ld b,(hl)', size: 1,},
  0x47: {mnemonic: 'ld b,a', size: 1,},
  0x48: {mnemonic: 'ld c,b', size: 1,},
  0x49: {mnemonic: 'ld c,c', size: 1,},
  0x4a: {mnemonic: 'ld c,d', size: 1,},
  0x4b: {mnemonic: 'ld c,e', size: 1,},
  0x4c: {mnemonic: 'ld c,h', size: 1,},
  0x4d: {mnemonic: 'ld c,l', size: 1,},
  0x4e: {mnemonic: 'ld c,(hl)', size: 1,},
  0x4f: {mnemonic: 'ld c,a', size: 1,},
  0x50: {mnemonic: 'ld d,b', size: 1,},
  0x51: {mnemonic: 'ld d,c', size: 1,},
  0x52: {mnemonic: 'ld d,d', size: 1,},
  0x53: {mnemonic: 'ld d,e', size: 1,},
  0x54: {mnemonic: 'ld d,h', size: 1,},
  0x55: {mnemonic: 'ld d,l', size: 1,},
  0x56: {mnemonic: 'ld d,(hl)', size: 1,},
  0x57: {mnemonic: 'ld d,a', size: 1,},
  0x58: {mnemonic: 'ld e,b', size: 1,},
  0x59: {mnemonic: 'ld e,c', size: 1,},
  0x5a: {mnemonic: 'ld e,d', size: 1,},
  0x5b: {mnemonic: 'ld e,e', size: 1,},
  0x5c: {mnemonic: 'ld e,h', size: 1,},
  0x5d: {mnemonic: 'ld e,l', size: 1,},
  0x5e: {mnemonic: 'ld e,(hl)', size: 1,},
  0x5f: {mnemonic: 'ld e,a', size: 1,},
  0x60: {mnemonic: 'ld h,b', size: 1,},
  0x61: {mnemonic: 'ld h,c', size: 1,},
  0x62: {mnemonic: 'ld h,d', size: 1,},
  0x63: {mnemonic: 'ld h,e', size: 1,},
  0x64: {mnemonic: 'ld h,h', size: 1,},
  0x65: {mnemonic: 'ld h,l', size: 1,},
  0x66: {mnemonic: 'ld h,(hl)', size: 1,},
  0x67: {mnemonic: 'ld h,a', size: 1,},
  0x68: {mnemonic: 'ld l,b', size: 1,},
  0x69: {mnemonic: 'ld l,c', size: 1,},
  0x6a: {mnemonic: 'ld l,d', size: 1,},
  0x6b: {mnemonic: 'ld l,e', size: 1,},
  0x6c: {mnemonic: 'ld l,h', size: 1,},
  0x6d: {mnemonic: 'ld l,l', size: 1,},
  0x6e: {mnemonic: 'ld l,(hl)', size: 1,},
  0x6f: {mnemonic: 'ld l,a', size: 1,},
  0x70: {mnemonic: 'ld (hl),b', size: 1,},
  0x71: {mnemonic: 'ld (hl),c', size: 1,},
  0x72: {mnemonic: 'ld (hl),d', size: 1,},
  0x73: {mnemonic: 'ld (hl),e', size: 1,},
  0x74: {mnemonic: 'ld (hl),h', size: 1,},
  0x75: {mnemonic: 'ld (hl),l', size: 1,},
  0x77: {mnemonic: 'ld (hl),a', size: 1,},
  0x78: {mnemonic: 'ld a,b', size: 1,},
  0x79: {mnemonic: 'ld a,c', size: 1,},
  0x7a: {mnemonic: 'ld a,d', size: 1,},
  0x7b: {mnemonic: 'ld a,e', size: 1,},
  0x7c: {mnemonic: 'ld a,h', size: 1,},
  0x7d: {mnemonic: 'ld a,l', size: 1,},
  0x7e: {mnemonic: 'ld a,(hl)', size: 1,},
  0x7f: {mnemonic: 'ld a,a', size: 1,},
  0x80: {mnemonic: 'add a,b', size: 1,},
  0x81: {mnemonic: 'add a,c', size: 1,},
  0x82: {mnemonic: 'add a,d', size: 1,},
  0x83: {mnemonic: 'add a,e', size: 1,},
  0x84: {mnemonic: 'add a,h', size: 1,},
  0x85: {mnemonic: 'add a,l', size: 1,},
  0x86: {mnemonic: 'add a,(hl)', size: 1,},
  0x87: {mnemonic: 'add a,a', size: 1,},
  0x88: {mnemonic: 'adc a,b', size: 1,},
  0x89: {mnemonic: 'adc a,c', size: 1,},
  0x8a: {mnemonic: 'adc a,d', size: 1,},
  0x8b: {mnemonic: 'adc a,e', size: 1,},
  0x8c: {mnemonic: 'adc a,h', size: 1,},
  0x8d: {mnemonic: 'adc a,l', size: 1,},
  0x8e: {mnemonic: 'adc a,(hl)', size: 1,},
  0x8f: {mnemonic: 'adc a,a', size: 1,},
  0x90: {mnemonic: 'sub b', size: 1,},
  0x91: {mnemonic: 'sub c', size: 1,},
  0x92: {mnemonic: 'sub d', size: 1,},
  0x93: {mnemonic: 'sub e', size: 1,},
  0x94: {mnemonic: 'sub h', size: 1,},
  0x95: {mnemonic: 'sub l', size: 1,},
  0x96: {mnemonic: 'sub (hl)', size: 1,},
  0x97: {mnemonic: 'sub a', size: 1,},
  0x98: {mnemonic: 'sbc a,b', size: 1,},
  0x99: {mnemonic: 'sbc a,c', size: 1,},
  0x9a: {mnemonic: 'sbc a,d', size: 1,},
  0x9b: {mnemonic: 'sbc a,e', size: 1,},
  0x9c: {mnemonic: 'sbc a,h', size: 1,},
  0x9d: {mnemonic: 'sbc a,l', size: 1,},
  0x9e: {mnemonic: 'sbc a,(hl)', size: 1,},
  0x9f: {mnemonic: 'sbc a,a', size: 1,},
  0xa0: {mnemonic: 'and b', size: 1,},
  0xa1: {mnemonic: 'and c', size: 1,},
  0xa2: {mnemonic: 'and d', size: 1,},
  0xa3: {mnemonic: 'and e', size: 1,},
  0xa4: {mnemonic: 'and h', size: 1,},
  0xa5: {mnemonic: 'and l', size: 1,},
  0xa6: {mnemonic: 'and (hl)', size: 1,},
  0xa7: {mnemonic: 'and a', size: 1,},
  0xa8: {mnemonic: 'xor b', size: 1,},
  0xa9: {mnemonic: 'xor c', size: 1,},
  0xaa: {mnemonic: 'xor d', size: 1,},
  0xab: {mnemonic: 'xor e', size: 1,},
  0xac: {mnemonic: 'xor h', size: 1,},
  0xad: {mnemonic: 'xor l', size: 1,},
  0xae: {mnemonic: 'xor (hl)', size: 1,},
  0xaf: {mnemonic: 'xor a', size: 1,},
  0xb0: {mnemonic: 'or b', size: 1,},
  0xb1: {mnemonic: 'or c', size: 1,},
  0xb2: {mnemonic: 'or d', size: 1,},
  0xb3: {mnemonic: 'or e', size: 1,},
  0xb4: {mnemonic: 'or h', size: 1,},
  0xb5: {mnemonic: 'or l', size: 1,},
  0xb6: {mnemonic: 'or (hl)', size: 1,},
  0xb7: {mnemonic: 'or a', size: 1,},
  0xb8: {mnemonic: 'cp b', size: 1,},
  0xb9: {mnemonic: 'cp c', size: 1,},
  0xba: {mnemonic: 'cp d', size: 1,},
  0xbb: {mnemonic: 'cp e', size: 1,},
  0xbc: {mnemonic: 'cp h', size: 1,},
  0xbd: {mnemonic: 'cp l', size: 1,},
  0xbe: {mnemonic: 'cp (hl)', size: 1,},
  0xbf: {mnemonic: 'cp a', size: 1,},
  0xc0: {mnemonic: 'ret nz', size: 1,},
  0xc1: {mnemonic: 'pop bc', size: 1,},
  0xc4: {mnemonic: 'call nz,**', size: 3,},
  0xc5: {mnemonic: 'push bc', size: 1,},
  0xc6: {mnemonic: `add a,*`, size: 2,},
  0xc8: {mnemonic: 'ret z', size: 1,},
  0xc9: {mnemonic: 'ret', size: 1,},
  0xcb: null,
  0xcc: {mnemonic: 'call z,**', size: 3,},
  0xcd: {mnemonic: 'call **', size: 3,},
  0xd0: {mnemonic: 'ret nc', size: 1,},
  0xd1: {mnemonic: 'pop de', size: 1,},
  0xd4: {mnemonic: 'call nc,**', size: 3,},
  0xd5: {mnemonic: 'push de', size: 1,},
  0xd7: null,
  0xd8: {mnemonic: 'ret c', size: 1,},
  0xd9: null,
  0xdc: {mnemonic: 'call c,**', size: 3,},
  0xdb: null,
  0xdd: null,
  0xdf: null,
  0xce: {mnemonic: 'adc a,*', size: 2,},
  0xd6: {mnemonic: 'sub *', size: 2,},
  0xde: {mnemonic: 'sbc a,*', size: 2,},
  0xe0: null,
  0xe1: {mnemonic: 'pop hl', size: 1,},
  0xe2: null,
  0xe4: null,
  0xe5: {mnemonic: 'push hl', size: 1,},
  0xe6: {mnemonic: 'and *', size: 2,},
  0xe7: null,
  0xe8: null,
  0xea: null,
  0xec: null,
  0xed: null,
  0xee: {mnemonic: 'xor *', size: 2,},
  0xef: null,
  0xf0: {mnemonic: 'ret p', size: 1,},
  0xf1: {mnemonic: 'pop af', size: 1,},
  0xf3: null,
  0xf4: null,
  0xf5: {mnemonic: 'push af', size: 1,},
  0xf6: {mnemonic: 'or *', size: 2,},
  0xf7: null,
  0xf8: {mnemonic: 'ret m', size: 1,},
  0xf9: {mnemonic: 'ld sp,hl', size: 1,},
  0xfb: null,
  0xfc: null,
  0xfd: null,
  0xfe: {mnemonic: 'cp *', size: 2,},
  0xff: null,
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
   * @return {string} hex value 0x00 to 0xff
   */
  static toByteString(decimal) {
    const hex = parseInt(decimal).toString(16);
    return `0x${'00'.substr(0, 2 - hex.length)}${hex}`;
  }

  /**
   * @param {string} decimal1
   * @param {string} decimal2
   * @return {string} little endian hex value 0x0000 to 0xffff
   */
  static toWordString(decimal1, decimal2) {
      const hex1 = parseInt(decimal1).toString(16);
      const hex2 = parseInt(decimal2).toString(16);
      return '0x' + '00'.substr(0, 2 - hex2.length) + hex2 +
          '00'.substr(0, 2 - hex1.length) + hex1;
  }

  /** @param {Uint8Array} uint8array */
  setUint8Array(uint8array) {
    this.input = uint8array;
  }

  /** @return {string} disassembled binary */
  disassemble() {
    if (this.input === null) {
      return 'No input stream';
    }

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
          mnemonic = mnemonic.replace('**',
              `#${Disasm.toWordString(
                  `${this.readByte_()}`, `${this.readByte_()}`)}`);
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
    if (this.nextByte === this.input.length) {
      throw new Error('EOF');
    }
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