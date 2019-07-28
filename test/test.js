import {expect} from 'chai';
import {describe, beforeEach} from 'mocha';
import Disasm from '../src/Disasm';

describe('Opcodes', () => {
  'use strict';
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
    Object.keys(incOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${incOpcodes[opcode]}`);
    });
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
    Object.keys(decOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${decOpcodes[opcode]}`);
    });
  });

  it('should disassemble add', () => {
    const addOneByteOpcodes = {
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
    Object.keys(addOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${addOneByteOpcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xc6,0xff]));
    expect(disasm.disassemble()).to.equal(`0x0100    add a,#0xff`);
  });

  it('should disassemble adc', () => {
    const adcOneByteOpcodes = {
      0x88: 'adc a,b',
      0x89: 'adc a,c',
      0x8a: 'adc a,d',
      0x8b: 'adc a,e',
      0x8c: 'adc a,h',
      0x8d: 'adc a,l',
      0x8e: 'adc a,(hl)',
      0x8f: 'adc a,a',
    };
    Object.keys(adcOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${adcOneByteOpcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xce,0xff]));
    expect(disasm.disassemble()).to.equal(`0x0100    adc a,#0xff`);
  });

  it('should disassemble ld with 1-byte instructions', () => {
    const ldOneByteOpcodes = {
      0x02: 'ld (bc),a',
      0x0a: 'ld a,(bc)',
      0x12: 'ld (de),a',
      0x1a: 'ld a,(de)',
      0x40: 'ld b,b',
      0x41: 'ld b,c',
      0x42: 'ld b,d',
      0x43: 'ld b,e',
      0x44: 'ld b,h',
      0x45: 'ld b,l',
      0x46: 'ld b,(hl)',
      0x47: 'ld b,a',
      0x48: 'ld c,b',
      0x49: 'ld c,c',
      0x4a: 'ld c,d',
      0x4b: 'ld c,e',
      0x4c: 'ld c,h',
      0x4d: 'ld c,l',
      0x4e: 'ld c,(hl)',
      0x4f: 'ld c,a',
      0x50: 'ld d,b',
      0x51: 'ld d,c',
      0x52: 'ld d,d',
      0x53: 'ld d,e',
      0x54: 'ld d,h',
      0x55: 'ld d,l',
      0x56: 'ld d,(hl)',
      0x57: 'ld d,a',
      0x58: 'ld e,b',
      0x59: 'ld e,c',
      0x5a: 'ld e,d',
      0x5b: 'ld e,e',
      0x5c: 'ld e,h',
      0x5d: 'ld e,l',
      0x5e: 'ld e,(hl)',
      0x5f: 'ld e,a',
      0x60: 'ld h,b',
      0x61: 'ld h,c',
      0x62: 'ld h,d',
      0x63: 'ld h,e',
      0x64: 'ld h,h',
      0x65: 'ld h,l',
      0x66: 'ld h,(hl)',
      0x67: 'ld h,a',
      0x68: 'ld l,b',
      0x69: 'ld l,c',
      0x6a: 'ld l,d',
      0x6b: 'ld l,e',
      0x6c: 'ld l,h',
      0x6d: 'ld l,l',
      0x6e: 'ld l,(hl)',
      0x6f: 'ld l,a',
      0x70: 'ld (hl),b',
      0x71: 'ld (hl),c',
      0x72: 'ld (hl),d',
      0x73: 'ld (hl),e',
      0x74: 'ld (hl),h',
      0x75: 'ld (hl),l',
      0x77: 'ld (hl),a',
      0x78: 'ld a,b',
      0x79: 'ld a,c',
      0x7a: 'ld a,d',
      0x7b: 'ld a,e',
      0x7c: 'ld a,h',
      0x7d: 'ld a,l',
      0x7e: 'ld a,(hl)',
      0x7f: 'ld a,a',
      0xf9: 'ld sp,hl'
    };
    Object.keys(ldOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${ldOneByteOpcodes[opcode]}`);
    });
  });

  it('should disassemble ld with 2-byte instructions', () => {
    const ldTwoBytesOpcodes = {
      0x06: 'ld b,*',
      0x0e: 'ld c,*',
      0x16: 'ld d,*',
      0x1e: 'ld e,*',
      0x26: 'ld h,*',
      0x2e: 'ld l,*',
      0x36: 'ld (hl),*',
      0x3e: 'ld a,*'
    };
    Object.keys(ldTwoBytesOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xff]));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${ldTwoBytesOpcodes[opcode].replace('*','#0xff')}`);
    });
  });

  it('should disassemble ld with 3-byte instructions', () => {
    const ldThreeBytesOpcodes = {
      0x01: 'ld bc,**',
      0x11: 'ld de,**',
      0x21: 'ld hl,**',
      0x22: 'ld (**),hl',
      0x2a: 'ld hl,(**)',
      0x31: 'ld sp,**',
      0x32: 'ld (**),a',
      0x3a: 'ld a,(**)'
    };
    Object.keys(ldThreeBytesOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xab, 0xcd]));
      expect(disasm.disassemble()).to.equal(
          `0x0100    ${ldThreeBytesOpcodes[opcode].replace('**','#0xcdab')}`);
    });
  });

  it('should disassemble shift operations', () => {
    const shiftOpcodes = {
      0x07: 'rlca',
      0x0f: 'rrca',
      0x17: 'rla',
      0x1f: 'rra'
    };
    Object.keys(shiftOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${shiftOpcodes[opcode]}`);
    });
  });

  it('should disassemble invert and flag operations', () => {
    const opcodes = {
      0x2f: 'cpl',
      0x37: 'scf',
      0x3f: 'ccf'
    };
    Object.keys(opcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${opcodes[opcode]}`);
    });
  });
});