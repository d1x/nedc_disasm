import fs from 'fs';

export default class Dumper {

  /**
   * @param {string} filename
   */
  setFilename(filename) {
    this.filename = filename;
    return this;
  }

  /**
   * @param {string} content
   */
  setContent(content) {
    this.content = content;
    return this;
  }

  writeFile() {
    if (!this.filename || !this.content) {
      console.log('[error] cannot write file');
      return;
    }
    fs.writeFileSync(this.filename, this.content);
  }
}