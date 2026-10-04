import fs from 'fs/promises';
import path from 'path';

// ==========================================
// CONFIGURATION
// ==========================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma4:e4b'; 
const OUTPUT_FILE = 'MISSED_FILES_REVIEW_REPORT.md';

// The explicit list of files that were skipped or truncated
const FILES_TO_REVIEW = [
    'backend/app.ts',
    'backend/Dockerfile',
    'frontend/Dockerfile',
    'frontend/src/components/layout/navbar.tsx',
    // 'frontend/src/app/admin/community/page.tsx',
    // 'frontend/src/app/admin/tasks/page.tsx',
    // 'frontend/src/app/application/page.tsx',
    // 'frontend/src/app/dashboard/community/page.tsx',
    // 'frontend/src/app/dashboard/leaderboard/page.tsx',
    // 'frontend/src/app/dashboard/missions/page.tsx',
    // 'frontend/src/components/admin/ApplicationModal.tsx',
    // 'frontend/src/components/sections/journey.tsx',
    'nginx/default.conf',
    'docker-compose.yaml'
];

// ==========================================
// THE STRICT SYSTEM PROMPT
// ==========================================
const SYSTEM_PROMPT = `
You are a Principal Security and Performance Auditor. 
Your ONLY job is to review the following code/configuration file and list its shortcomings.

STRICT RULES:
1. ONLY list security vulnerabilities, performance risks, and anti-patterns.
2. DO NOT rewrite the code or configuration.
3. DO NOT output fixed code blocks or refactored configuration examples.
4. Keep the review strictly as a bulleted list. 
5. If the file looks perfectly fine, simply output: "No critical issues found."
`;

async function runTargetedReview() {
    console.log(`\n🚀 Starting Targeted Local AI Review using ${MODEL}...`);
    
    // Initialize the separate report file
    await fs.writeFile(OUTPUT_FILE, `# Targeted Code & Config Review Report\nModel: ${MODEL}\n\n`);
    console.log(`Targeting ${FILES_TO_REVIEW.length} skipped files. Running sequentially...\n`);

    for (const relativePath of FILES_TO_REVIEW) {
        // Normalize path paths to match your current OS format
        const normalizedPath = path.normalize(relativePath);
        
        console.log(`\n--------------------------------------------------`);
        console.log(`🔍 Auditing: ${normalizedPath}...`);
        console.log(`--------------------------------------------------`);

        try {
            // Verify file exists before reading
            await fs.access(normalizedPath);
            const fileContent = await fs.readFile(normalizedPath, 'utf-8');
            
            const prompt = `${SYSTEM_PROMPT}\n\nFile Name: ${relativePath}\n\nContent:\n\`\`\`\n${fileContent}\n\`\`\``;

            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: MODEL,
                    prompt: prompt,
                    stream: true,
                    think: true,
                    options: {
                        num_ctx: 6144 // Stable 6K window to ensure Next.js pages process smoothly within memory limits
                    }
                })
            });

            if (!response.body) {
                throw new Error('ReadableStream not supported or missing response body.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let buffer = '';
            let finalReviewText = '';
            let isThinking = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); 

                for (const line of lines) {
                    if (!line.trim()) continue;
                    
                    const data = JSON.parse(line);
                    
                    if (data.thinking) {
                        if (!isThinking) {
                            process.stdout.write('\n\x1b[90m🤔 [Thinking Process]:\n'); 
                            isThinking = true;
                        }
                        process.stdout.write(`\x1b[90m${data.thinking}\x1b[0m`);
                    } 
                    else if (data.response) {
                        if (isThinking) {
                            process.stdout.write('\n\n\x1b[32m📝 [Final Review]:\n');
                            isThinking = false;
                        }
                        process.stdout.write(`\x1b[32m${data.response}\x1b[0m`);
                        finalReviewText += data.response;
                    }
                }
            }

            process.stdout.write('\n\n'); 
            
            const reviewFormat = `## File: \`${normalizedPath}\`\n${finalReviewText}\n\n---\n\n`;
            await fs.appendFile(OUTPUT_FILE, reviewFormat);

        } catch (error) {
            console.error(`\n❌ Skipped/Failed ${normalizedPath}:`, error.message);
            await fs.appendFile(OUTPUT_FILE, `## File: \`${normalizedPath}\`\n*Error or File Not Found: ${error.message}*\n\n---\n\n`);
        }
    }

    console.log(`\n✅ Targeted Review Complete! Open ${OUTPUT_FILE} to see the separate results.`);
}

runTargetedReview();