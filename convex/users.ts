import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get a user by Clerk ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (existingUser) {
      return existingUser._id;
    }
    
    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
    
    return userId;
  },
});

// Update a user
export const updateUser = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, updates);
    
    return user._id;
  },
}); 