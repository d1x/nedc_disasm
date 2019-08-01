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
      '    .org 0x100',
      '    nop',
      '    nop',
      '    nop',
      '    nop',
      '    nop',]
      .join('\n'));
  });

  it('should treat unsupported opcodes as data', () => {
    disasm.setUint8Array(new Uint8Array([0x00, 0x00, 0x00, 0xff, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    nop',
      '    nop',
      '    nop',
      '    .db 0xff',
      '    nop',]
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
      '    .org 0x100',
      '    nop',
      '    ld bc,#0xbcab',
      '    ld (bc),a',
      '    ld c,#0xff',
      '    nop',]
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
      '    .org 0x100',
      '    ld bc,#0xffff',
      '    .db 0xff',
      '    ld c,#0xff',
      '    nop',
      '    .db 0xff',]
      .join('\n'));
  });

  it('should handle relative jumps', () => {
    disasm.setUint8Array(new Uint8Array([
      0x18, 0x03, /* jr #0x03 ; relative +3 */
      0x01, 0x02, 0x03, /* data */
      0x00, /* next pc */]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jr #0x03',
      '    .db 0x01',
      '    .db 0x02',
      '    .db 0x03',
      '    nop',
    ].join('\n'));

    disasm.setUint8Array(new Uint8Array([
      0x18, 0x03, /* jr #0x03 ; relative +3 */
      0x01, 0x02, /* data */
      0x00, /* nop */
      0x18, 0xfd, /* jr #0xfd ; relative -3 */]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jr #0x03',
      '    .db 0x01',
      '    .db 0x02',
      '    nop',
      '    jr #0xfd',
    ].join('\n'));
  });

  it('should handle conditional, relative jumps', () => {
    disasm.setUint8Array(new Uint8Array([
      0x20, 0x03, /* jr nz,#0x03 ; relative +3 */
      0x00, 0x00, 0x00, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jr nz,#0x03',
      '    nop',
      '    nop',
      '    nop',
      '    nop',
    ].join('\n'));

    disasm.setUint8Array(new Uint8Array([
      0x10, 0x03, /* djnz #0x03 ; relative +3 */
      0x00, 0x00, 0x00, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    djnz #0x03',
      '    nop',
      '    nop',
      '    nop',
      '    nop',
    ].join('\n'));
  });

  it('should handle absolute jumps', () => {
    disasm.setUint8Array(new Uint8Array([
      0xc3, 0x05, 0x01, /* jp #0x0105 */
      0x01, 0x02, /* data */
      0x00, /* next pc */]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jp #0x0105',
      '    .db 0x01',
      '    .db 0x02',
      '    nop',
    ].join('\n'));
  });

  it('should handle conditional, absolute jumps', () => {
    disasm.setUint8Array(new Uint8Array([
      0xc2, 0x05, 0x01, /* jp nz,#0x0105 */
      0x00, 0x00, 0x00,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jp nz,#0x0105',
      '    nop',
      '    nop',
      '    nop',
    ].join('\n'));
  });

  it('should handle routine calls', () => {
    disasm.setUint8Array(new Uint8Array([
      0xcd, 0x05, 0x01, /* call #0x0105 */
      0x01, 0x02, /* data */
      0x00,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    call #0x0105',
      '    .db 0x01',
      '    .db 0x02',
      '    nop',
    ].join('\n'));
  });

  it('should handle routine calls with return', () => {
    disasm.setUint8Array(new Uint8Array([
      0xcd, 0x05, 0x01, /* call #0x0105 */
      0x00, 0x00,
      0x00, 0xc9,]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    call #0x0105',
      '    nop',
      '    nop',
      '    nop',
      '    ret',
    ].join('\n'));

    disasm.setUint8Array(new Uint8Array([
      0xc3, 0x07, 0x01, /* jp #0x0107 */
      0x01, 0x02, /* data */
      0xc9, /* routine */
      0x03, /* data */
      0xcd, 0x05, 0x01, /* call #0x0105 */
      0x00, /* next pc */]));
    expect(disasm.disassemble()).to.equal([
      '    .org 0x100',
      '    jp #0x0107',
      '    .db 0x01',
      '    .db 0x02',
      '    ret',
      '    .db 0x03',
      '    call #0x0105',
      '    nop',
    ].join('\n'));
  });
});