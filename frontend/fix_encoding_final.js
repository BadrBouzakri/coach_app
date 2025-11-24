const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src/data');

// Map of common mojibake to correct characters
const replacements = {
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã ': 'à',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã§': 'ç',
    'Ã‰': 'É',
    'Ãˆ': 'È',
    'Ã€': 'À',
    'Ã‚': 'Â',
    'ÃÊ': 'Ê',
    'ÃŽ': 'Î',
    'Ã”': 'Ô',
    'Ã›': 'Û',
    'Ã‡': 'Ç',
    "â€™": "'",
    "â€¦": "...",
    "Â": "" // Often appears as a ghost character before spaces
};

function fixEncoding(content) {
    let fixed = content;
    // Apply replacements multiple times in case of double corruption
    for (let i = 0; i < 3; i++) {
        let changed = false;
        for (const [bad, good] of Object.entries(replacements)) {
            if (fixed.includes(bad)) {
                fixed = fixed.split(bad).join(good);
                changed = true;
            }
        }
        if (!changed) break;
    }
    return fixed;
}

function processDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(directory, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const fixedContent = fixEncoding(content);

                if (content !== fixedContent) {
                    fs.writeFileSync(filePath, fixedContent, 'utf8');
                    console.log(`✅ Fixed encoding in: ${file}`);
                } else {
                    console.log(`👌 No issues found in: ${file}`);
                }
            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err);
            }
        }
    });
}

console.log("Starting encoding repair...");
processDirectory(dataDir);
console.log("Repair complete.");
