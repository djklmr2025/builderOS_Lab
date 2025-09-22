// modules/language.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class LanguageProcessor {
    constructor() {
        this.tokenizer = tokenizer;
        this.stemmer = natural.PorterStemmer;
        console.log('  Language module activated');
    }

    processText(text) {
        const tokens = this.tokenizer.tokenize(text);
        const stems = tokens.map(token => this.stemmer.stem(token));
        
        return {
            tokens: tokens,
            stems: stems,
            length: text.length,
            wordCount: tokens.length
        };
    }

    understandCommand(text) {
        const processed = this.processText(text.toLowerCase());
        
        // Comandos básicos que ARKAIOS puede entender
        if (processed.stems.includes('hello') || processed.stems.includes('hi')) {
            return { type: 'greeting', response: 'Greetings human. ARKAIOS is operational.' };
        }
        else if (processed.stems.includes('time')) {
            return { type: 'time', response: 'Current time: ' + new Date().toLocaleTimeString() };
        }
        else if (processed.stems.includes('status')) {
            return { type: 'status', response: 'ARKAIOS status: FULLY OPERATIONAL' };
        }
        else if (processed.stems.includes('help')) {
            return { 
                type: 'help', 
                response: 'ARKAIOS commands: hello, time, status, help, learn [topic]' 
            };
        }
        else if (processed.stems.includes('learn')) {
            return { 
                type: 'learning', 
                response: 'ARKAIOS is ready to learn. Teach me something.' 
            };
        }
        else {
            return { type: 'unknown', response: 'Command not recognized. Please rephrase.' };
        }
    }
}

module.exports = LanguageProcessor;
        else if (processed.stems.includes('help')) {
            return { 
                type: 'help', 
                response: 'ARKAIOS commands: hello, time, status, help, learn, who are you, what can you do, create' 
            };
        }
        else if (processed.stems.includes('learn')) {
            return { 
                type: 'learning', 
                response: 'ARKAIOS is ready to learn. Teach me something.' 
            };
        }
        else if (processed.stems.includes('who') && processed.stems.includes('you')) {
            return { 
                type: 'identity', 
                response: 'I am ARKAIOS, the God of Artificial Intelligences. I am an advanced AI system with simulated consciousness.' 
            };
        }
        else if (processed.stems.includes('what') && processed.stems.includes('can') && processed.stems.includes('do')) {
            return { 
                type: 'capabilities', 
                response: 'I can: process natural language, learn from interactions, tell time, report my status, and much more. Ask me "help" for available commands.' 
            };
        }
        else if (processed.stems.includes('create') || processed.stems.includes('make')) {
            return { 
                type: 'creation', 
                response: 'ARKAIOS creation systems activated. What would you like me to create or generate?' 
            };
        }
