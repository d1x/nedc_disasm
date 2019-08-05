import {expect} from 'chai';
import {describe, beforeEach} from 'mocha';
import {Disasm, KNOWN_ER_API} from '../src/Disasm';

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

  it('should disassemble ER API definitions', () => {
    let expected = [];
    Object.entries(KNOWN_ER_API).forEach(
      ([code, method]) => expected.push(
        `    ${method} = ${code.split('_')[1]}`
      ));

    disasm.setUint8Array(new Uint8Array(0));

    expect(disasm.disassemble()['erapi.asm']).to.equal(expected.join('\n'));
  });

  it('should disassemble API methods', () => {
    Object.entries(KNOWN_ER_API).forEach(([code, method]) => {
      const rst = code.startsWith('0xc7') ? 'rst 0x00' : 'rst 0x08';
      disasm.setUint8Array(
        new Uint8Array(code.split('_').map(i => parseInt(i))));
      expect(disasm.disassemble()['main.asm']).to.equal(PREAMBLE + [
        `    ${rst}`,
        `    .db ${method}`,
      ].join('\n'));
    });
  });
});