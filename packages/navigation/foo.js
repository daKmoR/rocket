const fs = require('fs');
const { SaxEventType, SAXParser } = require('sax-wasm');

// Get the path to the WebAssembly binary and load it
const saxPath = require.resolve('sax-wasm/lib/sax-wasm.wasm');
const saxWasmBuffer = fs.readFileSync(saxPath);

// Instantiate
const options = { highWaterMark: 32 * 1024 }; // 32k chunks
const parser = new SAXParser(
  SaxEventType.Attribute | SaxEventType.OpenTag | SaxEventType.Text | SaxEventType.CloseTag,
  options,
);

let capture = false;
const headings = [];
let captured = { text: '' };

parser.eventHandler = (ev, data) => {
  if (ev === SaxEventType.OpenTag) {
    if (data.name === 'h2') {
      capture = true;
    }
  }

  if (capture && ev === SaxEventType.Text) {
    captured.text += data.value;
  }
  if (ev === SaxEventType.Attribute) {
    if (data.name === 'id') {
      captured.id = data.value;
    }
  }

  if (ev === SaxEventType.CloseTag) {
    if (data.name === 'h2') {
      capture = false;
      headings.push(captured);
      captured = { text: '' };
    }
  }
};

// Instantiate and prepare the wasm for parsing
parser.prepareWasm(saxWasmBuffer).then(ready => {
  if (ready) {
    parser.write(
      Buffer.from(
        `<p>asdf</p>
        <h2 id="start">
        <a class="anchor" href="#start"><svg class="octicon octicon-link" viewBox="0 0 16 16" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Start <span>now</span>!</h2>
        <p>asdf</p>
        <h2 id="more">more</h2>
      `,
      ),
    );

    console.log(headings);
  }
});
