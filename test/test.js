import {expect} from 'chai';
import {describe, beforeEach} from 'mocha';
import Disasm from '../src/Disasm';

describe('Opcodes', () => {

  let disasm;

  beforeEach('', () => {
    disasm = new Disasm();
  });

  it('should disassemble nop', () => {
    disasm.setUint8Array(new Uint8Array([0x00]));
    expect(disasm.disassemble()).to.equal('0x0100    nop');
  });

  it('should disassemble increment registers', () => {
    const incOpcodes = {
      0x03: 'inc bc',
      0x04: 'inc b',
      0x0c: 'inc c',
      0x13: 'inc de',
      0x14: 'inc d',
      0x1c: 'inc e',
      0x23: 'inc hl',
      0x24: 'inc h',
      0x2c: 'inc l',
      0x33: 'inc sp',
      0x34: 'inc (hl)',
      0x3c: 'inc a'
    };
    for(let opcode in incOpcodes) {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${incOpcodes[opcode]}`);
    }
  });

  it('should detect invalid opcodes', () => {
    const invalidOpcodes = [0x08, 0x27, 0xcb, 0xd7, 0xd9, 0xdb, 0xdd, 0xdf,
      0xe0, 0xe2, 0xe4, 0xe7, 0xe8, 0xea, 0xec, 0xed, 0xef, 0xf3, 0xf4, 0xf7,
      0xfb, 0xfc, 0xfd, 0xff];
    invalidOpcodes.forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`e-Reader unsupported opcode: ${Disasm.toByteString(opcode)}`);
    });
  });
});