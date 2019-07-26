import {expect} from 'chai';
import {describe, before} from 'mocha';
import Disasm from '../src/Disasm';

describe('Opcodes', () => {

  let disasm;

  before('', () => {
    disasm = new Disasm();
  });

  it('should disassemble nop', () => {
    const input = new Uint8Array(1);
    input[0] = 0;
    disasm.setUint8Array(input);
    expect(disasm.disassemble()).to.equal('0x0100    nop');
  });
});