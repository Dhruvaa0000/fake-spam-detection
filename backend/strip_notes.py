import re
import os

files_to_clean = [
    "main.py",
    "search_utils.py",
    "train_model.py",
    "cron_update.py",
    "../frontend/script.js",
    "../frontend/index.html",
    "../frontend/style.css"
]

def clean_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, not found.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('#') and not stripped.startswith('#!'):
            continue
        if stripped.startswith('//'):
            continue
        if stripped.startswith('<!--') and stripped.endswith('-->'):
            continue
            
        cleaned_lines.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)
    print(f"Cleaned notes from {filepath}")

for file in files_to_clean:
    clean_file(file)

print("Done removing notes without altering code logic.")
