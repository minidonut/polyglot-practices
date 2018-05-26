const fs = require('fs');

process.chdir('./sources')

const path = process.argv[2]

fs.mkdirSync(path);

process.chdir('./' + path);

fs.mkdirSync('test')

fs.writeFileSync('README.md', `##${path.split('/').reverse()[0]}`)
