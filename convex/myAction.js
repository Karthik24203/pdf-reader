import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.array(v.string()), // Ensure splitText is an array of strings
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText, // Array of texts
      args.splitText.map(() => ({ fileId: args.fileId })), // Attach metadata for each text
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyB-D5KtI7ymbmtY1oDEezFrSXGeNvHcoKc",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    return "complete";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyB-D5KtI7ymbmtY1oDEezFrSXGeNvHcoKc",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    try {
      // Get top 5 most relevant results with scores
      const results = await vectorStore.similaritySearch(args.query, 5);

      // Log the entire results to understand what's being returned
      console.log("Raw Search Results:", results);

      // Combine all pageContent values to provide a more context-rich answer
      const combinedContent = results.map((r) => r.pageContent).join(" ");

      return combinedContent
        ? JSON.stringify(results)
        : "No relevant data found";
    } catch (error) {
      console.error("Error in search action:", error);
      throw new Error("Failed to perform similarity search.");
    }
  },
});
