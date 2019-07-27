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

  it('should detect unsupported opcodes', () => {
    const unsupportedOpcodes = [0x08, 0x27, 0xcb, 0xd7, 0xd9, 0xdb, 0xdd, 0xdf,
      0xe0, 0xe2, 0xe4, 0xe7, 0xe8, 0xea, 0xec, 0xed, 0xef, 0xf3, 0xf4, 0xf7,
      0xfb, 0xfc, 0xfd, 0xff];
    unsupportedOpcodes.forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
        .equal(`e-Reader unsupported opcode: ${Disasm.toByteString(opcode)}`);
    });
  });

  it('should disassemble dec', () => {
    const decOpcodes = {
      0x05: 'dec b',
      0x0b: 'dec bc',
      0x0d: 'dec c',
      0x15: 'dec d',
      0x1b: 'dec de',
      0x1d: 'dec e',
      0x25: 'dec h',
      0x2b: 'dec hl',
      0x2d: 'dec l',
      0x35: 'dec (hl)',
      0x3b: 'dec sp',
      0x3d: 'dec a'
    };
    for(let opcode in decOpcodes) {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${decOpcodes[opcode]}`);
    }
  });

  it('should disassemble add', () => {
    const addOpcodes = {
      0x09: 'add hl,bc',
      0x19: 'add hl,de',
      0x29: 'add hl,hl',
      0x39: 'add hl,sp',
      0x80: 'add a,b',
      0x81: 'add a,c',
      0x82: 'add a,d',
      0x83: 'add a,e',
      0x84: 'add a,h',
      0x85: 'add a,l',
      0x86: 'add a,(hl)',
      0x87: 'add a,a'
    };
    for(let opcode in addOpcodes) {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${addOpcodes[opcode]}`);
    }
    disasm.setUint8Array(new Uint8Array([0xc6,0xff]));
    expect(disasm.disassemble()).to.equal(`0x0100    add a,#0xff`);
  });
});