import { Request, Response, NextFunction } from "express";
import service from "../services/health.service";

async function get(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await service.get(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export default {
  get,
};
