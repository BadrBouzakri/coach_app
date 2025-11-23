const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

// Comprehensive mojibake replacements
const replacements = {
    'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à', 'Ã¢': 'â',
    'Ãª': 'ê', 'Ã®': 'î', 'Ã´': 'ô', 'Ã»': 'û',
    'Ã§': 'ç', 'Ã¹': 'ù', 'Ã‰': 'É', 'Ãˆ': 'È',
    'Ã€': 'À', 'Ã‚': 'Â', 'ÃŠ': 'Ê', 'ÃŽ': 'Î',
    'Ã"': 'Ô', 'Ã›': 'Û', 'Ã‡': 'Ç', 'Ã™': 'Ù',
    'Å"': 'œ', 'Å'': 'Œ', 'â€™': "'", 'â€œ': '"',
    'â€': '"', 'â€"': '–', 'â€"': '—',
    'Ã¯': 'ï', 'Ã¼': 'ü', 'Ã«': 'ë',
};

function fixEncoding(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;

        // Apply all replacements
        for (const [old, newChar] of Object.entries(replacements)) {
            content = content.split(old).join(newChar);
        }

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed: ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`  No changes: ${path.basename(filePath)}`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error in ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

function processDirectory(dir) {
    let fixedCount = 0;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            fixedCount += processDirectory(filePath);
        } else if (file.endsWith('.json')) {
            if (fixEncoding(filePath)) {
                fixedCount++;
            }
        }
    }

    return fixedCount;
}

console.log('='.repeat(50));
console.log('Starting encoding fix...');
console.log('='.repeat(50));

const fixedCount = processDirectory(dataDir);

console.log('='.repeat(50));
console.log(`Fixed ${fixedCount} files!`);
console.log('='.repeat(50));
