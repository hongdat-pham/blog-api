import { Post, User, Comment } from "@prisma/client";

export type CreatePostDto = {
  title: string;
  content: string;
  authorId: number;
};

export type UpdatePostDto = {
  title?: string;
  content?: string;
};
export type PostWithRelations = Post & {
  author: Pick<User, "id" | "name">;
  comments: Comment[];
};

export type PostWithCount = Post & {
  _count: {
    comments: number;
  };
};
