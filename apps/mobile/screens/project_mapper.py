import os
import sys

# --- Configuration ---
# Directories to ignore during the scan (e.g., environments, build folders, version control)
EXCLUDE_DIRS = [
    '.git', '__pycache__', 'venv', 'env', 'node_modules', 'dist', 'build', '.idea', '.vscode'
]
# File extensions to ignore (e.g., binary files, compressed files)
EXCLUDE_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz',
    '.sqlite3', '.db', '.bin', '.dll', '.exe', '.lock', '.log', '.pyd', '.pyc'
]
# Maximum character limit for file content included in the output (to avoid exceeding LLM context limits)
MAX_CONTENT_CHARS = 15000 
# Maximum number of files to process to prevent extremely long outputs
MAX_FILES = 100 
# --- End Configuration ---


def get_file_content(filepath):
    """Safely reads file content, handling encoding errors and size limits."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read(MAX_CONTENT_CHARS)
        
        if len(content) == MAX_CONTENT_CHARS:
            content += f"\n\n... [Content truncated at {MAX_CONTENT_CHARS} characters] ..."
            
        return content
    except UnicodeDecodeError:
        # Ignore binary or non-UTF-8 files
        return "[Content skipped: Binary or non-UTF-8 encoded file]"
    except Exception as e:
        return f"[Content skipped: Error reading file: {e}]"

def map_project(root_dir, output_file_path):
    """
    Scans the project directory, builds the structure map, and extracts content.
    """
    print(f"Starting scan of directory: {os.path.abspath(root_dir)}")
    
    # 1. Structure the output
    structure_map = f"# Project Context Map for: {os.path.basename(os.path.abspath(root_dir))}\n\n"
    structure_map += "This file contains the directory structure and the contents of important project files.\n\n"
    structure_map += "---\n\n## 1. Directory Structure\n\n"
    
    content_map = "\n---\n\n## 2. File Contents\n"

    file_count = 0

    for root, dirs, files in os.walk(root_dir, topdown=True):
        # Filter out excluded directories in place for os.walk to respect
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        # Calculate indentation level
        depth = root[len(root_dir):].count(os.sep)
        indent = '│   ' * depth
        
        # Add the current directory to the structure map (relative path)
        relative_path = os.path.relpath(root, root_dir)
        if relative_path != '.':
            structure_map += f"{indent}├── **{os.path.basename(root)}/**\n"
            indent += '│   ' # Increase indent for contents

        # Process files in the current directory
        for i, file_name in enumerate(files):
            file_path = os.path.join(root, file_name)
            
            # Check for file extension exclusion
            if any(file_name.lower().endswith(ext) for ext in EXCLUDE_EXTENSIONS):
                continue
            
            # Check max file limit
            if file_count >= MAX_FILES:
                structure_map += f"{indent}└── ... (Maximum file limit reached: {MAX_FILES} files processed)\n"
                print(f"Maximum file limit ({MAX_FILES}) reached. Stopping scan.")
                break

            file_count += 1
            
            # Add file to the structure map
            structure_map += f"{indent}├── {file_name}\n"
            
            # 2. Extract and format file content
            relative_file_path = os.path.relpath(file_path, root_dir)
            content = get_file_content(file_path)
            
            # Determine code block language for syntax highlighting (optional, helps LLM)
            extension = os.path.splitext(file_name)[1].lstrip('.')
            
            content_map += f"\n\n### File: `{relative_file_path}`\n\n"
            content_map += f"```{extension if extension else 'text'}\n"
            content_map += content
            content_map += "\n```"

        if file_count >= MAX_FILES:
            break

    # Combine and write the final output
    final_output = structure_map + content_map
    
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(final_output)
        print(f"\n✅ Successfully generated project context map to: {os.path.abspath(output_file_path)}")
        print(f"Total files processed: {file_count}")
        print("You can now copy the contents of this file directly into a Gemini prompt.")

    except Exception as e:
        print(f"\n❌ ERROR: Could not write output file {output_file_path}. Reason: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # If no path is provided, use the current directory
        project_path = os.getcwd()
        print("No directory path provided. Defaulting to current directory.")
    else:
        project_path = sys.argv[1]
    
    if not os.path.isdir(project_path):
        print(f"Error: The path '{project_path}' is not a valid directory.")
        sys.exit(1)

    # Use a fixed output name for easy use in LLM prompts
    output_filename = "project_context.md"
    map_project(project_path, output_filename)
