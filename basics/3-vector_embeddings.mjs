import OpenAI from "openai";
const openai = new OpenAI();

const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: "The quick brown fox jumped over the lazy dog",
});

console.log(embedding);