import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all book covers for a user
export const getBookCovers = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookCovers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single book cover by ID
export const getBookCover = query({
  args: { id: v.id("bookCovers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new book cover
export const createBookCover = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    genre: v.string(),
    description: v.optional(v.string()),
    style: v.string(),
    imageUrl: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const coverId = await ctx.db.insert("bookCovers", {
      ...args,
      createdAt: Date.now(),
    });
    return coverId;
  },
});

// Delete a book cover
export const deleteBookCover = mutation({
  args: { 
    id: v.id("bookCovers"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const cover = await ctx.db.get(args.id);
    
    if (!cover) {
      throw new Error("Book cover not found");
    }
    
    // Check if the user owns this book cover
    if (cover.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
}); 