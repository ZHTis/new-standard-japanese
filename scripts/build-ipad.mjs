import {readFileSync,writeFileSync,mkdirSync,cpSync,existsSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {books,lessons} from '../src/data.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const dest=resolve(root,'ipad/Hiyori/Resources');
mkdirSync(dest,{recursive:true});
// Compile the small, dependency-free ES modules into one local script. WKWebView
// can then load the bundle offline without a server or file-origin module fetches.
const js=['src/data.js','src/native.js','src/preview-config.js','src/materials.js','src/adaptive.js','src/human-audio.js','src/answer-flow.js','src/app.js'].map(p=>read(p)
  .replace(/^import .*?;\s*$/gm,'')
  .replace(/\bexport (?=(const|let|function)\b)/g,'')).join('\n');
writeFileSync(resolve(dest,'app.js'),`(()=>{\n'use strict';\n${js}\n})();\n`);
writeFileSync(resolve(dest,'style.css'),read('src/style.css').replace(/^@import[^;]+;\s*/gm,''));
writeFileSync(resolve(dest,'fonts.css'),read('src/fonts.css'));
cpSync(resolve(root,'src/fonts'),resolve(dest,'fonts'),{recursive:true});
writeFileSync(resolve(dest,'index.html'),read('index.html')
  .replace('src/style.css','style.css')
  .replace('src/fonts.css','fonts.css')
  .replace(/type="module" src="src\/app\.js(?:\?[^"]*)?"/,'defer src="app.js"'));
writeFileSync(resolve(dest,'curriculum.json'),JSON.stringify({books,lessons},null,2));
// Keep textbook content in its ignored directory, never inline in tracked JS/JSON.
const personalDest=resolve(dest,'private-materials');
rmSync(personalDest,{recursive:true,force:true});
if(existsSync(resolve(root,'private-materials/catalog.js'))){
 cpSync(resolve(root,'private-materials'),personalDest,{recursive:true,filter:source=>!source.endsWith('.py')&&!source.endsWith('sources.json')});
 console.log('Local personal materials copied separately (excluded from Git).');
}
console.log(`iPad offline bundle ready: ${lessons.length} lessons, no remote assets.`);
