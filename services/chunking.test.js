const { chunkText } = require("./chunking");

test("chunkText splits text into multiple chunks", () => {
    const longText = "word ".repeat(500); // long enough to need multiple chunks
    const chunks = chunkText(longText, 100, 20);
    expect(chunks.length).toBeGreaterThan(1);
});

test("chunkText returns one chunk for short text", () => {
    const shortText = "This is short.";
    const chunks = chunkText(shortText, 100, 20);
    expect(chunks.length).toBe(1);
});

test("chunks have overlapping content", () => {
    const text = "A".repeat(50) + "B".repeat(50) + "C".repeat(50);
    const chunks = chunkText(text, 60, 20);
    expect(chunks[0].slice(-20)).toBe(chunks[1].slice(0, 20));
});