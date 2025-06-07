import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    const payload = await request.text();

    const wh = new Webhook(webhookSecret);
    try {
      const event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-signature": svixSignature,
        "svix-timestamp": svixTimestamp,
      }) as any;

      if (event.type === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } =
          event.data;
        const email = email_addresses[0].email_address;

        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: `${first_name || ""} ${last_name || ""}`.trim(),
          clerkId: id,
          image: image_url,
          username: `${first_name}`,
        });
      }

      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("Webhook error:", err);
      return new Response("Verification failed", { status: 400 });
    }
  }),
});

export default http;
