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
    disasm.setUint8Array(new Uint8Array([0x00,]));
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
      0x3c: 'inc a',
    };
    Object.keys(incOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${incOpcodes[opcode]}`);
    });
  });

  it('should detect unsupported opcodes', () => {
    const unsupportedOpcodes = [0x08, 0x27, 0xcb, 0xd7, 0xd9, 0xdb, 0xdd, 0xdf,
      0xe0, 0xe2, 0xe4, 0xe7, 0xe8, 0xea, 0xec, 0xed, 0xef, 0xf3, 0xf4, 0xf7,
      0xfb, 0xfc, 0xfd, 0xff,];
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
      0x3d: 'dec a',
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
      0x87: 'add a,a',
    };
    Object.keys(addOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${addOneByteOpcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xc6,0xff,]));
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
    disasm.setUint8Array(new Uint8Array([0xce,0xff,]));
    expect(disasm.disassemble()).to.equal(`0x0100    adc a,#0xff`);
  });

  it('should disassemble sub', () => {
    const subOneByteOpcodes = {
      0x90: 'sub b',
      0x91: 'sub c',
      0x92: 'sub d',
      0x93: 'sub e',
      0x94: 'sub h',
      0x95: 'sub l',
      0x96: 'sub (hl)',
      0x97: 'sub a',
    };
    Object.keys(subOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${subOneByteOpcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xd6,0xff,]));
    expect(disasm.disassemble()).to.equal(`0x0100    sub #0xff`);
  });

  it('should disassemble sbc', () => {
    const subOneByteOpcodes = {
      0x98: 'sbc a,b',
      0x99: 'sbc a,c',
      0x9a: 'sbc a,d',
      0x9b: 'sbc a,e',
      0x9c: 'sbc a,h',
      0x9d: 'sbc a,l',
      0x9e: 'sbc a,(hl)',
      0x9f: 'sbc a,a',
    };
    Object.keys(subOneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${subOneByteOpcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xde,0xff,]));
    expect(disasm.disassemble()).to.equal(`0x0100    sbc a,#0xff`);
  });

  it('should disassemble bit operations', () => {
    const oneByteOpcodes = {
      0xa0: 'and b',
      0xa1: 'and c',
      0xa2: 'and d',
      0xa3: 'and e',
      0xa4: 'and h',
      0xa5: 'and l',
      0xa6: 'and (hl)',
      0xa7: 'and a',
      0xa8: 'xor b',
      0xa9: 'xor c',
      0xaa: 'xor d',
      0xab: 'xor e',
      0xac: 'xor h',
      0xad: 'xor l',
      0xae: 'xor (hl)',
      0xaf: 'xor a',
      0xb0: 'or b',
      0xb1: 'or c',
      0xb2: 'or d',
      0xb3: 'or e',
      0xb4: 'or h',
      0xb5: 'or l',
      0xb6: 'or (hl)',
      0xb7: 'or a',
    };
    const twoByteOpcodes = {
      0xe6: 'and *',
      0xee: 'xor *',
      0xf6: 'or *',
    };
    Object.keys(oneByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${oneByteOpcodes[opcode]}`);
    });
    Object.keys(twoByteOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xff,]));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${twoByteOpcodes[opcode].replace('*', '#0xff')}`);
    });
  });

  it('should disassemble cp', () => {
    const opcodes = {
      0xb8: 'cp b',
      0xb9: 'cp c',
      0xba: 'cp d',
      0xbb: 'cp e',
      0xbc: 'cp h',
      0xbd: 'cp l',
      0xbe: 'cp (hl)',
      0xbf: 'cp a',
    };
    Object.keys(opcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${opcodes[opcode]}`);
    });
    disasm.setUint8Array(new Uint8Array([0xfe,0xff,]));
    expect(disasm.disassemble()).to.equal(`0x0100    cp #0xff`);
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
      0xf9: 'ld sp,hl',
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
      0x3e: 'ld a,*',
    };
    Object.keys(ldTwoBytesOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xff,]));
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
      0x3a: 'ld a,(**)',
    };
    Object.keys(ldThreeBytesOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xab, 0xcd,]));
      expect(disasm.disassemble()).to.equal(
          `0x0100    ${ldThreeBytesOpcodes[opcode].replace('**','#0xcdab')}`);
    });
  });

  it('should disassemble shift operations', () => {
    const shiftOpcodes = {
      0x07: 'rlca',
      0x0f: 'rrca',
      0x17: 'rla',
      0x1f: 'rra',
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
      0x3f: 'ccf',
    };
    Object.keys(opcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${opcodes[opcode]}`);
    });
  });

  it('should disassemble call and ret', () => {
    const retOpcodes = {
      0xc0: 'ret nz',
      0xc8: 'ret z',
      0xc9: 'ret',
      0xd0: 'ret nc',
      0xd8: 'ret c',
      0xf0: 'ret p',
      0xf8: 'ret m',
    };
    const callOpcodes = {
      0xc4: 'call nz,**',
      0xcc: 'call z,**',
      0xcd: 'call **',
      0xd4: 'call nc,**',
      0xdc: 'call c,**',
    };
    Object.keys(retOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${retOpcodes[opcode]}`);
    });
    Object.keys(callOpcodes).forEach((opcode) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xab, 0xdc,]));
      expect(disasm.disassemble()).to
          .equal(`0x0100    ${callOpcodes[opcode].replace('**', '#0xdcab')}`);
    });
  });

  it('should disassemble stack operations', () => {
    const opcodes = {
      0xc1: 'pop bc',
      0xc5: 'push bc',
      0xd1: 'pop de',
      0xd5: 'push de',
      0xe1: 'pop hl',
      0xe5: 'push hl',
      0xf1: 'pop af',
      0xf5: 'push af',
    };
    Object.entries(opcodes).forEach(([opcode, mnemonic]) => {
      disasm.setUint8Array(new Uint8Array([].concat(opcode)));
      expect(disasm.disassemble()).to.equal(`0x0100    ${mnemonic}`);
    });
  });

  it('should disassemble jumps', () => {
    const twoByteOpcodes = {
      0x10: 'djnz *',
      0x18: 'jr *',
      0x20: 'jr nz,*',
      0x28: 'jr z,*',
      0x30: 'jr nc,*',
      0x38: 'jr c,*',
    };
    const threeBytesOpcodes = {
      0xc2: 'jp nz,**',
      0xca: 'jp z,**',
      0xd2: 'jp nc,**',
      0xda: 'jp c,**',
      0xf2: 'jp p,**',
      0xfa: 'jp m,**',
    };
    disasm.setUint8Array(new Uint8Array([0xe9,]));
    expect(disasm.disassemble()).to.equal('0x0100    jp (hl)');

    Object.entries(twoByteOpcodes).forEach(([opcode, mnemonic]) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xff,]));
      expect(disasm.disassemble()).to.equal(
        `0x0100    ${mnemonic.replace('*', '#0xff')}`);
    });
    Object.entries(threeBytesOpcodes).forEach(([opcode, mnemonic]) => {
      disasm.setUint8Array(new Uint8Array([opcode, 0xab, 0xcd,]));
      expect(disasm.disassemble()).to.equal(
        `0x0100    ${mnemonic.replace('**', '#0xcdab')}`);
    });
  });

  it('should disassemble rst, or API calls', () => {
    disasm.setUint8Array(new Uint8Array([0xc7, 0xff,]));
    expect(disasm.disassemble()).to.equal(
        '0x0100    rst 0x00\n' +
        '0x0101    .db 0xff            ; API call');

    disasm.setUint8Array(new Uint8Array([0xcf, 0xff,]));
    expect(disasm.disassemble()).to.equal(
        '0x0100    rst 0x08\n' +
        '0x0101    .db 0xff            ; API call');
  });

  it('should disassemble ex', () => {
    disasm.setUint8Array(new Uint8Array([0xe3,]));
    expect(disasm.disassemble()).to.equal('0x0100    ex (sp),hl');

    disasm.setUint8Array(new Uint8Array([0xeb,]));
    expect(disasm.disassemble()).to.equal('0x0100    ex de,hl');
  });

  it('should disassemble wait', () => {
    disasm.setUint8Array(new Uint8Array([0x76,]));
    expect(disasm.disassemble()).to.equal('0x0100    wait a');

    disasm.setUint8Array(new Uint8Array([0xd3, 0xff,]));
    expect(disasm.disassemble()).to.equal('0x0100    wait #0xff');
  });
});