const fs = require('fs');
const path = require('path');

function parseStudyGuide(content) {
    const topics = [];
    const lines = content.split('\n');
    let currentTopic = null;
    let currentMode = null; // 'MC', 'SA', 'AP', 'ANSWERS'
    let currentMC = null;
    let parsingAnswerBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Check for Topic headers
        const topicMatch = trimmed.match(/^##\s*(LN\d+.*)/);
        if (topicMatch) {
            if (topicMatch[1].indexOf('Master Rapid Review') === -1 && topicMatch[1].indexOf('Big-picture') === -1) {
                currentTopic = {
                    title: topicMatch[1].trim(),
                    questions: []
                };
                topics.push(currentTopic);
                currentMode = null;
            }
            continue;
        }

        if (!currentTopic) continue;

        // 2. Check for Mode switches
        if (trimmed.match(/##? Multiple Choice/i)) {
            currentMode = 'MC';
            parsingAnswerBlock = false;
            continue;
        }
        if (trimmed.match(/##? Short Response/i)) {
            currentMode = 'SA';
            parsingAnswerBlock = false;
            continue;
        }
        if (trimmed.match(/(##? Applied programming prompt|Applied \/ Programming Prompt|\*\*Applied programming prompt\*\*)/i)) {
            currentMode = 'AP';
            parsingAnswerBlock = false;
            continue;
        }
        if (trimmed.match(/##? Answers/i)) {
            parsingAnswerBlock = true;
            currentMode = 'ANSWERS';
            continue;
        }

        // 3. Parse Questions
        if (currentMode === 'MC') {
            const mcStart = trimmed.match(/^\*\*(\d+)\.\*\*\s*(.*)/);
            if (mcStart) {
                if (currentMC) currentTopic.questions.push(currentMC);
                currentMC = {
                    id: mcStart[1],
                    type: 'mc',
                    text: mcStart[2],
                    options: [],
                    answer: '',
                    explanation: ''
                };
            } else if (currentMC) {
                const optMatch = trimmed.match(/^([A-D])\.\s*(.*)/);
                if (optMatch) {
                    currentMC.options.push({ letter: optMatch[1], text: optMatch[2] });
                } else if (trimmed !== '') {
                    // It might be multiline question text
                    if (currentMC.options.length === 0) {
                        currentMC.text += "\n" + trimmed;
                    }
                }
            }
        }

        if (currentMode === 'SA' && trimmed !== '') {
            const saStart = trimmed.match(/^\*\*(\d+)\.\*\*\s*(.*)/);
            if (saStart) {
                if (currentMC) { currentTopic.questions.push(currentMC); currentMC = null; }
                currentMC = { id: saStart[1], type: 'sa', text: saStart[2], answer: '', explanation: '' };
            } else if (currentMC) {
                currentMC.text += "\n" + trimmed;
            }
        }
        if (currentMode === 'AP' && trimmed !== '') {
            const apStart = trimmed.match(/^\*\*(\d+)\.\*\*\s*(.*)/);
            if (apStart) {
                if (currentMC) { currentTopic.questions.push(currentMC); currentMC = null; }
                currentMC = { id: apStart[1], type: 'ap', text: apStart[2], answer: '', explanation: '' };
            } else if (currentMC) {
                currentMC.text += "\n" + trimmed;
            } else if (trimmed && !trimmed.startsWith('**')) { // handle AP that lacks number prefix in set1 sometimes
                if (trimmed.toLowerCase() !== 'applied programming prompt' && !trimmed.startsWith('Write a')) {
                    if (!currentMC) {
                        currentMC = { id: 'AP', type: 'ap', text: trimmed, answer: '', explanation: '' };
                    } else {
                        currentMC.text += "\n" + trimmed;
                    }
                } else if (trimmed.startsWith('Write a') || trimmed.startsWith('You have')) {
                    if (!currentMC) currentMC = { id: 'AP', type: 'ap', text: trimmed, answer: '', explanation: '' };
                    else currentMC.text += "\n" + trimmed;
                }
            }
        }

        // 4. Parse Answers
        if (parsingAnswerBlock) {
            if (currentMC) { currentTopic.questions.push(currentMC); currentMC = null; }
            
            const mcAnsMatch = trimmed.match(/^(\d+)\.\s*\*\*(.*?)\*\*\s*[—\-]\s*(.*)$/); // 1. **A** — text
            if (mcAnsMatch) {
                const qId = mcAnsMatch[1];
                const letter = mcAnsMatch[2];
                const exp = mcAnsMatch[3];
                const q = currentTopic.questions.find(q => q.id === qId);
                if (q) {
                    q.answer = letter;
                    q.explanation = exp;
                }
            } else {
                // Set 2 uses `**1. B** — ...` or `**5.** ...`
                const altMatch1 = trimmed.match(/^\*\*(\d+)\.\s*([A-D])\*\*\s*[—\-]\s*(.*)$/);
                if (altMatch1) {
                    const qId = altMatch1[1];
                    const q = currentTopic.questions.find(q => q.id === qId);
                    if (q) { q.answer = altMatch1[2]; q.explanation = altMatch1[3]; }
                }
                const altMatch2 = trimmed.match(/^\*\*(\d+)\.\*\*\s*(.*)$/); // for SA/AP mostly
                if (altMatch2) {
                    const qId = altMatch2[1];
                    const q = currentTopic.questions.find(q => q.id === qId);
                    if (q) {
                        q.explanation = altMatch2[2] ? altMatch2[2] : '';
                    }
                } else if (trimmed.startsWith('Applied:')) {
                    const q = currentTopic.questions.find(q => q.id === 'AP' || q.type === 'ap');
                    if (q) q.explanation += "\n" + trimmed;
                } else if (!trimmed.startsWith('---') && trimmed !== '') {
                    // Keep appending to last found answer
                    const recentQ = currentTopic.questions[currentTopic.questions.length - 1]; // This logic is flaky, find by looking backwards for non-mc
                    for (let j = currentTopic.questions.length - 1; j >= 0; j--) {
                        if (currentTopic.questions[j].type !== 'mc' && currentTopic.questions[j].explanation !== undefined) {
                            currentTopic.questions[j].explanation += "\n" + trimmed;
                            break;
                        } else if (currentTopic.questions[j].type === 'mc' && currentTopic.questions[j].explanation !== undefined && (currentTopic.questions[j].answer === '' || currentTopic.questions[j].answer)) {
                            // If it's a code block inside MC answer or something
                            if (trimmed.startsWith('```') || currentTopic.questions[j].explanation.includes('```')) {
                                currentTopic.questions[j].explanation += "\n" + trimmed;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    if (currentMC) { currentTopic.questions.push(currentMC); currentMC = null; }
    return topics.filter(t => t.questions.length > 0);
}

function parseMockFinal(content) {
    const lines = content.split('\n');
    const questions = [];
    let currentQ = null;
    let mode = 'Q'; // 'Q' or 'A'
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === '# Answer Key and Explanations') {
            mode = 'A';
            if (currentQ) { questions.push(currentQ); currentQ = null; }
            continue;
        }

        if (mode === 'Q') {
            const qHeaderMatch = trimmed.match(/^## (\d+)\./);
            if (qHeaderMatch) {
                if (currentQ) questions.push(currentQ);
                currentQ = { id: qHeaderMatch[1], type: 'Unknown', text: '', options: [], answer: '', explanation: '' };
            } else if (currentQ) {
                const optMatch = trimmed.match(/^([A-D])\.\s*(.*)/);
                if (optMatch) {
                    currentQ.options.push({ letter: optMatch[1], text: optMatch[2] });
                } else if (trimmed !== '' && !trimmed.startsWith('---') && !trimmed.startsWith('#')) {
                    if (currentQ.options.length === 0) {
                        currentQ.text += (currentQ.text ? "\n" : "") + trimmed;
                    }
                }
            }
        } else if (mode === 'A') {
            const aHeaderMatch = trimmed.match(/^## (\d+)\./);
            if (aHeaderMatch) {
                currentQ = questions.find(q => q.id === aHeaderMatch[1]);
            } else if (currentQ) {
                // **Answer: B. `/etc`**
                const ansMatch = trimmed.match(/^\*\*Answer:\s+([A-D])\.\s+.*?\*\*/);
                if (ansMatch) {
                    currentQ.answer = ansMatch[1];
                } else if (trimmed.startsWith('**Sample answer:**')) {
                    currentQ.answer = 'Sample Answer';
                } else if (trimmed !== '' && !trimmed.startsWith('---')) {
                    currentQ.explanation += (currentQ.explanation ? "\n" : "") + trimmed;
                }
            }
        }
    }
    
    questions.forEach(q => {
        if (q.options.length > 0) q.type = 'mc';
        else q.type = 'sa';
    });
    
    return questions;
}

try {
    const set1 = fs.readFileSync(path.join(__dirname, '../COSC350_Massive_Study_Guide.md'), 'utf-8');
    const set2 = fs.readFileSync(path.join(__dirname, '../COSC350_Massive_Study_Guide_Set2.md'), 'utf-8');
    const mock = fs.readFileSync(path.join(__dirname, '../COSC350_Mock_Final_Review.md'), 'utf-8');

    const topics1 = parseStudyGuide(set1);
    const topics2 = parseStudyGuide(set2);
    
    // Merge topics
    const mergedTopics = {};
    const merge = (topics, setName) => {
        topics.forEach(t => {
            const title = t.title.split(' - ')[0]; // Group by LN3, LN4, etc.
            if (!mergedTopics[title]) {
                mergedTopics[title] = { title: t.title, questions: [] };
            }
            t.questions.forEach(q => q.source = setName);
            mergedTopics[title].questions.push(...t.questions);
        });
    };
    merge(topics1, 'Set 1');
    merge(topics2, 'Set 2');
    
    const finalTopics = Object.values(mergedTopics);
    const mockFinal = parseMockFinal(mock);

    const outDir = path.join(__dirname, '../cosc350-interactive-review/src/data');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outDir, 'topics.json'), JSON.stringify(finalTopics, null, 2));
    fs.writeFileSync(path.join(outDir, 'mockFinal.json'), JSON.stringify(mockFinal, null, 2));
    console.log('Parsing complete!');
} catch (e) {
    console.error(e);
}
