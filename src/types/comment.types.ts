export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export type CreateCommentDto = {
  author: string;
  content: string;
};
