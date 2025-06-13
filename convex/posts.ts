import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) throw new Error("Image not found");

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");
    const userId = currentUser._id;

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .unique();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      const post = await ctx.db.get(args.postId);
      if (post && typeof post.likes === "number") {
        await ctx.db.patch(args.postId, { likes: post.likes - 1 });
      }
      return false;
    } else {
      await ctx.db.insert("likes", { userId, postId: args.postId });
      const post = await ctx.db.get(args.postId);
      if (post && typeof post.likes === "number") {
        await ctx.db.patch(args.postId, { likes: post.likes + 1 });
      }
      return true;
    }
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    let userIdConvex: Id<"users"> | null = null;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .first();
      userIdConvex = user?._id ?? null;
    }

    const posts = await ctx.db.query("posts").order("desc").collect();

    const likes = userIdConvex
      ? await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) => q.eq("userId", userIdConvex))
          .collect()
      : [];

    const likedPostIds = new Set(likes.map((like) => like.postId));

    const postsWithAuthor = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        return {
          ...post,
          author: {
            _id: author?._id,
            username: author?.username,
            image: author?.image,
          },
          isLiked: likedPostIds.has(post._id),
        };
      })
    );

    return postsWithAuthor;
  },
});
