import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// Prisma 7 yêu cầu driver adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  // Xóa data cũ trước (để chạy seed nhiều lần không bị lỗi duplicate)
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Tạo 3 users
  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" },
  });

  const bob = await prisma.user.create({
    data: { name: "Bob", email: "bob@example.com" },
  });

  const charlie = await prisma.user.create({
    data: { name: "Charlie", email: "charlie@example.com" },
  });

  console.log("✅ Đã tạo 3 users");

  // Tạo 5 posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with Node.js",
      content: "Node.js is a JavaScript runtime...",
      authorId: alice.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Express Middleware Explained",
      content: "Middleware is a function that...",
      authorId: alice.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "TypeScript Best Practices",
      content: "TypeScript adds static typing...",
      authorId: bob.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: "Prisma ORM Guide",
      content: "Prisma makes database access easy...",
      authorId: bob.id,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: "REST API Design Tips",
      content: "Good REST APIs use proper status codes...",
      authorId: charlie.id,
    },
  });

  console.log("✅ Đã tạo 5 posts");

  // Tạo 10 comments (2 comments mỗi post)
  await prisma.comment.createMany({
    data: [
      { content: "Great article!", postId: post1.id, updatedAt: new Date() },
      {
        content: "Very helpful, thanks!",
        postId: post1.id,
        updatedAt: new Date(),
      },
      {
        content: "Love this explanation.",
        postId: post2.id,
        updatedAt: new Date(),
      },
      {
        content: "Middleware finally makes sense!",
        postId: post2.id,
        updatedAt: new Date(),
      },
      {
        content: "TypeScript changed my life.",
        postId: post3.id,
        updatedAt: new Date(),
      },
      {
        content: "Great tips on generics!",
        postId: post3.id,
        updatedAt: new Date(),
      },
      {
        content: "Prisma is amazing.",
        postId: post4.id,
        updatedAt: new Date(),
      },
      {
        content: "Much better than raw SQL.",
        postId: post4.id,
        updatedAt: new Date(),
      },
      {
        content: "Status codes are so important.",
        postId: post5.id,
        updatedAt: new Date(),
      },
      {
        content: "Bookmarked this post!",
        postId: post5.id,
        updatedAt: new Date(),
      },
    ],
  });

  console.log("✅ Đã tạo 10 comments");
  console.log("🎉 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
