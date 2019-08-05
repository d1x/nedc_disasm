import {expect} from 'chai';
import {describe, beforeEach} from 'mocha';
import Disasm from '../src/Disasm';

const PREAMBLE = [
  '    .area CODE (ABS)',
  '    .include "erapi.asm"',
  '    .org 0x100',
  '',
].join('\n');

describe('e-Reader API', () => {
  'use strict';
  let disasm;

  beforeEach('', () => {
    disasm = new Disasm();
  });

  it('should disassemble ERAPI definitions', () => {
    disasm.setUint8Array(new Uint8Array(0));
    expect(disasm.disassemble()['erapi.asm']).to.equal([
      '    ER_API_FadeIn = 0x00',
    ].join('\n'));
  });

  it('should disassemble ERAPI_FadeIn', () => {
    disasm.setUint8Array(new Uint8Array([0xc7, 0x00,]));
    expect(disasm.disassemble()['main.asm']).to.equal(PREAMBLE + [
      '    rst 0x00',
      '    .db ER_API_FadeIn',].join('\n'));
  });
});