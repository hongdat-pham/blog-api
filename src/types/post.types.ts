export type CreatePostDto = {
  title: string;
  content: string;
  authorId: number;
};

export type UpdatePostDto = {
  title?: string;
  content?: string;
};
