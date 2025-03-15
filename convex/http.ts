import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook handler for Clerk events
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const { type, data } = payload;
    
    // Handle user creation
    if (type === "user.created") {
      await ctx.runMutation(api.clerk.createUser, {
        userId: data.id,
        email: data.email_addresses[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || undefined,
      });
    } 
    // Handle user update
    else if (type === "user.updated") {
      await ctx.runMutation(api.clerk.updateUser, {
        userId: data.id,
        email: data.email_addresses[0]?.email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || undefined,
      });
    } 
    // Handle user deletion
    else if (type === "user.deleted") {
      await ctx.runMutation(api.clerk.deleteUser, {
        userId: data.id,
      });
    }
    
    return new Response(null, { status: 200 });
  }),
});

export default http; 