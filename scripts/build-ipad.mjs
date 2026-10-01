import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {books,lessons} from '../src/data.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const dest=resolve(root,'ipad/Hiyori/Resources');
mkdirSync(dest,{recursive:true});
// Compile the small, dependency-free ES modules into one local script. WKWebView
// can then load the bundle offline without a server or file-origin module fetches.
const js=['src/data.js','src/native.js','src/preview-config.js','src/app.js'].map(p=>read(p)
  .replace(/^import .*?;\s*$/gm,'')
  .replace(/\bexport (?=(const|let|function)\b)/g,'')).join('\n');
writeFileSync(resolve(dest,'app.js'),`(()=>{\n'use strict';\n${js}\n})();\n`);
writeFileSync(resolve(dest,'style.css'),read('src/style.css').replace(/^@import[^;]+;\s*/gm,''));
writeFileSync(resolve(dest,'index.html'),read('index.html')
  .replace('src/style.css','style.css')
  .replace('type="module" src="src/app.js"','defer src="app.js"'));
writeFileSync(resolve(dest,'curriculum.json'),JSON.stringify({books,lessons},null,2));
console.log(`iPad offline bundle ready: ${lessons.length} lessons, no remote assets.`);
