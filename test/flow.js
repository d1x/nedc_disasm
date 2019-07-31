import {expect} from 'chai';
import {describe, beforeEach} from 'mocha';
import Disasm from '../src/Disasm';

describe('Program flow', () => {
  'use strict';
  let disasm;

  beforeEach('', () => {
    disasm = new Disasm();
  });

  it('should disassemble nops', () => {
    disasm.setUint8Array(new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '0x0100    nop',
      '0x0101    nop',
      '0x0102    nop',
      '0x0103    nop',
      '0x0104    nop',]
      .join('\n'));
  });

  it('should treat unsupported opcodes as data', () => {
    disasm.setUint8Array(new Uint8Array([0x00, 0x00, 0x00, 0xff, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '0x0100    nop',
      '0x0101    nop',
      '0x0102    nop',
      '0x0103    .db 0xff',
      '0x0104    nop',]
      .join('\n'));
  });

  it('should handle multiple sized instructions', () => {
    disasm.setUint8Array(new Uint8Array([
      0x00/*size=1*/,
      0x01/*size=3*/, 0xab, 0xbc,
      0x02/*size=1*/,
      0x0e/*size=2*/, 0xff,
      0x00,]));
    expect(disasm.disassemble()).to.equal([
      '0x0100    nop',
      '0x0101    ld bc,#0xbcab',
      '0x0104    ld (bc),a',
      '0x0105    ld c,#0xff',
      '0x0107    nop',]
      .join('\n'));
  });

  it('should handle multiple sized instructions and unsupported opcodes', () => {
    disasm.setUint8Array(new Uint8Array([
      0x01/*size=3*/, 0xff, 0xff,
      0xff/*size=1*/,
      0x0e/*size=2*/, 0xff,
      0x00/*size=1*/,
      0xff,]));
    expect(disasm.disassemble()).to.equal([
      '0x0100    ld bc,#0xffff',
      '0x0103    .db 0xff',
      '0x0104    ld c,#0xff',
      '0x0106    nop',
      '0x0107    .db 0xff',]
      .join('\n'));
  });
});