import os
import json

def fix_encoding(file_path):
    """Fix mojibake encoding issues in JSON files"""
    try:
        # Read file with UTF-8
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Comprehensive mojibake replacements
        replacements = {
            'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à', 'Ã¢': 'â',
            'Ãª': 'ê', 'Ã®': 'î', 'Ã´': 'ô', 'Ã»': 'û',
            'Ã§': 'ç', 'Ã¹': 'ù', 'Ã‰': 'É', 'Ãˆ': 'È',
            'Ã€': 'À', 'Ã‚': 'Â', 'ÃŠ': 'Ê', 'ÃŽ': 'Î',
            'Ã"': 'Ô', 'Ã›': 'Û', 'Ã‡': 'Ç', 'Ã™': 'Ù',
            'Å"': 'œ', 'Å'': 'Œ', 'â€™': "'", 'â€œ': '"',
            'â€': '"', 'â€"': '–', 'â€"': '—',
            'Ã¯': 'ï', 'Ã¼': 'ü', 'Ã«': 'ë',
        }
        
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        # Save if changed
        if content != original:
            with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)
            print(f"✓ Fixed: {os.path.basename(file_path)}")
            return True
        else:
            print(f"  No changes: {os.path.basename(file_path)}")
            return False
    except Exception as e:
        print(f"✗ Error in {os.path.basename(file_path)}: {e}")
        return False

def main():
    data_dir = "d:/Tech/IA/gravity/coach_app/frontend/src/data"
    fixed_count = 0
    
    print("=" * 50)
    print("Starting encoding fix...")
    print("=" * 50)
    
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                if fix_encoding(file_path):
                    fixed_count += 1
    
    print("=" * 50)
    print(f"Fixed {fixed_count} files!")
    print("=" * 50)

if __name__ == "__main__":
    main()
