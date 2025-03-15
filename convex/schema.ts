import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user information
  users: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  // Documents table to store writing documents
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(), // Clerk user ID
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  // Book covers table to store generated book covers
  bookCovers: defineTable({
    title: v.string(),
    author: v.string(),
    genre: v.string(),
    description: v.optional(v.string()),
    style: v.string(),
    imageUrl: v.string(),
    userId: v.string(), // Clerk user ID
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
}); 