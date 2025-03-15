import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all documents for a user
export const getDocuments = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single document by ID
export const getDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new document
export const createDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return documentId;
  },
});

// Update an existing document
export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updates } = args;
    const document = await ctx.db.get(id);
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    // Check if the user owns this document
    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { 
    id: v.id("documents"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    // Check if the user owns this document
    if (document.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
}); 