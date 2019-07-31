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
});