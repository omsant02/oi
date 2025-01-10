import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
export const openai = new OpenAI();

const EntitiesSchema = z.object({
attributes: z.array(z.string()),
colors: z.array(z.string()),
animals: z.array(z.string()),
});

const stream = openai.beta.chat.completions
.stream({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "Extract entities from the input text" },
    {
      role: "user",
      content:
        "The quick brown fox jumps over the lazy dog with piercing blue eyes",
    },
  ],
  response_format: zodResponseFormat(EntitiesSchema, "entities"),
})
.on("refusal.done", () => console.log("request refused"))
.on("content.delta", ({ snapshot, parsed }) => {
  console.log("content:", snapshot);
  console.log("parsed:", parsed);
  console.log();
})
.on("content.done", (props) => {
  console.log(props);
});

await stream.done();

const finalCompletion = await stream.finalChatCompletion();

console.log(finalCompletion);