import fs from 'fs/promises';
import path from 'path';

// ==========================================
// CONFIGURATION
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma4:e4b'; 
const TARGET_DIR = './'; 
const OUTPUT_FILE = 'CODE_REVIEW_REPORT.md';

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'public'];
const IGNORE_FILES = ['.env', '.env.local', '.env.development', 'package-lock.json', 'yarn.lock'];
const ALLOWED_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

// ==========================================
// THE STRICT SYSTEM PROMPT
// ==========================================
const SYSTEM_PROMPT = `
You are a Principal Security and Performance Auditor. 
Your ONLY job is to review the following code and list its shortcomings.

STRICT RULES:
1. ONLY list security vulnerabilities, performance risks, and anti-patterns.
2. DO NOT rewrite the code.
3. DO NOT output fixed code blocks or refactored examples.
4. Keep the review strictly as a bulleted list. 
5. If the file looks perfectly fine, simply output: "No critical issues found."
`;

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory() && IGNORE_DIRS.includes(dirent.name)) return [];
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

// ==========================================
// MAIN: EXECUTE THE REVIEW PIPELINE
// ==========================================
async function runReview() {
    console.log(`\n🚀 Starting Local AI Code Review using ${MODEL}...`);
    
    await fs.writeFile(OUTPUT_FILE, `# Automated Code Review Report\nModel: ${MODEL}\n\n`);

    const allFiles = await getFiles(TARGET_DIR);
    const codeFiles = allFiles.filter(file => {
        const filename = path.basename(file);
        const extension = path.extname(file);
        return ALLOWED_EXTENSIONS.includes(extension) && !IGNORE_FILES.includes(filename);
    });
    
    console.log(`Found ${codeFiles.length} files to review. Processing sequentially to protect VRAM...\n`);

    for (const filePath of codeFiles) {
        const relativePath = path.relative(TARGET_DIR, filePath);
        console.log(`\n--------------------------------------------------`);
        console.log(`🔍 Auditing: ${relativePath}...`);
        console.log(`--------------------------------------------------`);
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const prompt = `${SYSTEM_PROMPT}\n\nFile Name: ${relativePath}\n\nCode:\n\`\`\`\n${fileContent}\n\`\`\``;

        try {
            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: MODEL,
                    prompt: prompt,
                    stream: true, // Switched to true for real-time data
                    think: true,   // Explicitly asks the model to output reasoning tokens
                    options: {
                        num_ctx: 8192
                    }
                })
            });

            // Node.js Web Streams Reader for intercepting the chunks
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let buffer = '';
            let finalReviewText = '';
            let isThinking = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the binary chunk and split it by newlines (NDJSON format)
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Hold onto any incomplete JSON strings until the next chunk

                for (const line of lines) {
                    if (!line.trim()) continue;
                    
                    const data = JSON.parse(line);
                    
                    // 1. Intercept and print Thinking Tokens in Grey
                    if (data.thinking) {
                        if (!isThinking) {
                            process.stdout.write('\n\x1b[90m🤔 [Thinking Process]:\n'); 
                            isThinking = true;
                        }
                        process.stdout.write(`\x1b[90m${data.thinking}\x1b[0m`);
                    } 
                    
                    // 2. Intercept and print Final Answer Tokens in Green
                    else if (data.response) {
                        if (isThinking) {
                            process.stdout.write('\n\n\x1b[32m📝 [Final Review]:\n');
                            isThinking = false;
                        }
                        process.stdout.write(`\x1b[32m${data.response}\x1b[0m`);
                        finalReviewText += data.response; // Save only the final answer for the file
                    }
                }
            }

            process.stdout.write('\n\n'); 
            
            // Append ONLY the final review (no grey thinking text) to the markdown file
            const reviewFormat = `## File: \`${relativePath}\`\n${finalReviewText}\n\n---\n\n`;
            await fs.appendFile(OUTPUT_FILE, reviewFormat);

        } catch (error) {
            console.error(`\n❌ Failed to review ${relativePath}:`, error.message);
            await fs.appendFile(OUTPUT_FILE, `## File: \`${relativePath}\`\n*Error generating review: ${error.message}*\n\n---\n\n`);
        }
    }

    console.log(`\n✅ Review Complete! Open ${OUTPUT_FILE} to see the results.`);
}

runReview();