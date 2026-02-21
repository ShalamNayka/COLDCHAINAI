const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.tsx')) {
            let content = fs.readFileSync(p, 'utf8');

            // Replace \` with `
            content = content.replace(/\\\`/g, '\`');

            // Replace \$ with $
            content = content.replace(/\\\$/g, '$');

            fs.writeFileSync(p, content);
        }
    });
}

walk('src');
console.log('Fixed escape characters in tsx files');
