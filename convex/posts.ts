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

// ...existing code...

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const user = await getAuthenticatedUser(ctx);

    // Check if already liked
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id).eq("postId", postId)
      )
      .first();

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(postId, { likes: post.likes - 1 });
      return false;
    } else {
      await ctx.db.insert("likes", { userId: user._id, postId });
      await ctx.db.patch(postId, { likes: post.likes + 1 });

      if (user._id !== post.userId) {
        await ctx.db.insert("notification", {
          receiverId: post.userId,
          senderId: user._id,
          type: "like",
          postId,
        });
      }
      return true;
    }
  },
});
// ...existing code...

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

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (post.userId !== currentUser._id) throw new Error("Unauthorized");

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const notifications = await ctx.db
      .query("notification")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    await ctx.storage.delete(post.storageId);

    await ctx.db.delete(args.postId);
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});

export const getPostsByUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const user = args.userId
      ? await ctx.db.get(args.userId)
      : await getAuthenticatedUser(ctx);

    if (!user) throw new Error("User not found");

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
      .collect();

    return posts;
  },
});
