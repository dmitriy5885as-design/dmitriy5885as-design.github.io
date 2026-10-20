import fs from 'node:fs';
for(const route of ['projects/syscore','projects/svoya-igra','projects/electronic-journal','projects/chess','post']){fs.mkdirSync('dist/'+route,{recursive:true});fs.copyFileSync('dist/index.html','dist/'+route+'/index.html');}
fs.copyFileSync('dist/index.html','dist/404.html');fs.writeFileSync('dist/.nojekyll','');
