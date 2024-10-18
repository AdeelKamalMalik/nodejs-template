import { Request } from "express";

export type RequestWithUser = Request & { user_id: string }

export type GetBlogsPayload = {
  search: string,
  page: number,
  limit: number
}