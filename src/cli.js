
import commandLineArgs from 'command-line-args';
import Loader from './Loader';
import Dumper from './Dumper';
import {Disasm} from './Disasm';

const options = commandLineArgs(
  { name: 'input', alias: 'i', type: String, }
);

(function start(filename) {
  'use strict';
  if (!filename) {
    return console.log(
      `Usage: npm start -- -i input_file`);
  }
  const disasm = new Disasm();
  disasm.setUint8Array(new Loader(filename).asUint8Array());
  const dumper = new Dumper();
  const files = disasm.disassemble();
  Object.entries(files).forEach(([filename, content]) => dumper
    .setFilename(filename)
    .setContent(content)
    .writeFile());
})(options.input);



