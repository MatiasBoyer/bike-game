import { Request, Response, NextFunction } from "express";
import BaseError from "../exceptions/base.exception";
import logging from "../utils/db/log.util";

export default async (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await logging.InsertLogIntoDB(logging.LogType.Error, err.message, err.stack);
  } catch (err) {
    console.error(`Failed logging into DB\n${err}`);
  }

  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);

  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
