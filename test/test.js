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