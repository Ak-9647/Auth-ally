import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Create a user from Clerk webhook
export const createUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (existingUser) {
      return existingUser._id;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      createdAt: Date.now(),
    });
    
    return userId;
  },
});

// Update a user from Clerk webhook
export const updateUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const updates: any = {};
    if (args.email !== undefined) updates.email = args.email;
    if (args.name !== undefined) updates.name = args.name;
    
    await ctx.db.patch(user._id, updates);
    
    return user._id;
  },
});

// Delete a user from Clerk webhook
export const deleteUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.delete(user._id);
    
    return user._id;
  },
}); 