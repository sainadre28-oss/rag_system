const { chunkText } = require("./services/chunking");

const sampleText = "This is a test document. ".repeat(100);
const chunks = chunkText(sampleText);

console.log("Number of chunks:", chunks.length);
console.log("First chunk length:", chunks[0].length);
console.log("First chunk preview:", chunks[0].slice(0, 100));