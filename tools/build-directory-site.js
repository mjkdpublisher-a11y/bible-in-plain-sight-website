// Finalize the approved directory-based site. The rendered pages in docs/ are
// source-controlled; the author's editable design project is documented in notes/.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const out=path.resolve(__dirname,'../docs');
const domain='https://www.bibleinplainsight.com';
function canonical(file,route){
 let s=fs.readFileSync(file,'utf8').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi,'');
 s=s.replace('</head>',`<link rel="canonical" href="${domain}${route}">\n</head>`);fs.writeFileSync(file,s);
}
canonical(path.join(out,'index.html'),'/');
canonical(path.join(out,'book/index.html'),'/book/');
for(const slug of ['privacy-policy','support','legal-notice']){
 const file=path.join(out,slug,'index.html');canonical(file,`/${slug}/`);
 // Existing Google Play and app links use extensionless or .html addresses.
 fs.copyFileSync(file,path.join(out,slug+'.html'));
}
let notFound=fs.readFileSync(path.join(out,'support/index.html'),'utf8');
notFound=notFound.replace(/<title>[\s\S]*?<\/title>/,'<title>Page not found | Bible in Plain Sight</title>')
 .replace(/<link\b[^>]*rel="canonical"[^>]*>/g,'')
 .replace(/<main\b[\s\S]*?<\/main>/,'<main id="main" class="document-content wrap" style="padding-block:70px;min-height:50vh"><h1>Page not found.</h1><p>This page may have moved. Explore <a href="/">Bible in Plain Sight</a>, <a href="/book/">the book</a>, or <a href="/support/">get help</a>.</p></main>')
 .replace(/<div class="document-breadcrumb[\s\S]*?<\/div>/,'')
 .replace('data-page="support"','data-page="not-found"')
 .replace('</head>','<meta name="robots" content="noindex">\n</head>');
fs.writeFileSync(path.join(out,'404.html'),notFound);
const routes=['/','/book/','/privacy-policy/','/support/','/legal-notice/'];
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(r=>`  <url><loc>${domain}${r}</loc></url>`).join('\n')+'\n</urlset>\n');
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else files.push(f);}}walk(out);
const fingerprint=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0,12);
function version(ref,from,htmlLink=false){
 if(/^(?:https?:|data:|mailto:|tel:|#)/i.test(ref))return ref;
 const [raw]=ref.split(/[?#]/);if(!raw)return ref;
 const file=raw.startsWith('/')?path.join(out,raw):path.resolve(path.dirname(from),raw);
 if(!file.startsWith(out+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return ref;
 if(htmlLink&&/\.html$/i.test(raw))return ref;
 return raw+'?v='+fingerprint(file);
}
// Fonts and images first, then their CSS, then iframe screens, scripts and pages.
const currentSource=f=>!f.startsWith(path.join(out,'assets')+path.sep);
for(const f of files.filter(f=>f.endsWith('.css')&&currentSource(f))){const s=fs.readFileSync(f,'utf8');fs.writeFileSync(f,s.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(_,q,r)=>`url(${q}${version(r,f)}${q})`));}
function stampHtml(f){const s=fs.readFileSync(f,'utf8');fs.writeFileSync(f,s.replace(/\b(href|src)="([^"#]+)"/g,(_,attr,ref)=>`${attr}="${version(ref,f,attr==='href')}"`));}
for(const f of files.filter(f=>f.endsWith('.html')&&f.startsWith(path.join(out,'screens')+path.sep)))stampHtml(f);
const screenVersion=crypto.createHash('sha256').update(files.filter(f=>f.endsWith('.html')&&f.startsWith(path.join(out,'screens')+path.sep)).sort().map(f=>fingerprint(f)).join('')).digest('hex').slice(0,12);
for(const f of files.filter(f=>f.endsWith('.js')&&currentSource(f))){let s=fs.readFileSync(f,'utf8');s=s.replace(/(['"])(screens\/[\w-]+\.html)(?:\?v=[^'"]+)?\1/g,(_,q,ref)=>`${q}${version('/'+ref,f).slice(1)}${q}`);if(f===path.join(out,'app.js'))s=s.replace(/screen\.file \+ ['"]\?v=[^'"]+['"]/g,`screen.file + '?v=${screenVersion}'`);fs.writeFileSync(f,s);}
for(const f of files.filter(f=>f.endsWith('.html')&&!f.startsWith(path.join(out,'screens')+path.sep)))stampHtml(f);
console.log('Directory site built: legacy aliases, 404, sitemap and versioned assets.');
