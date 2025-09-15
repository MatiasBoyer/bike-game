import dbUtil from "./db.util";
import executedb from "../../services/executedb.service";
import { v4 as uuidv4 } from "uuid";

enum LogType {
  Information = "INFO",
  Error = "ERR",
  Warning = "WARN",
  Log = "LOG",
}

const uuid = uuidv4();

async function InsertLogIntoDB(type: LogType, message: string, stack: string | undefined = undefined) {
  return await executedb("logging/InsertLog.sql", 
    { 
        branch: process.env.BRANCH || 'dev',
        uuid,
        type,
        message,
        stack
    });
}

const originalConsole = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  log: console.log,
};

function overrideConsole() {
  console.log = (...args: any[]) => {
    originalConsole.log(...args);

    InsertLogIntoDB(LogType.Log, args.map(String).join(" ")).catch((err) =>
      originalConsole.error("Failed to log info to DB:", err)
    );
  };

  console.info = (...args: any[]) => {
    originalConsole.info(...args);

    InsertLogIntoDB(LogType.Information, args.map(String).join(" ")).catch(
      (err) => originalConsole.error("Failed to log info to DB:", err)
    );
  };

  console.warn = (...args: any[]) => {
    originalConsole.warn(...args);

    InsertLogIntoDB(LogType.Warning, args.map(String).join(" ")).catch((err) =>
      originalConsole.error("Failed to log warn to DB:", err)
    );
  };

  console.error = (...args: any[]) => {
    originalConsole.error(...args);

    const stack = args.find((arg) => arg instanceof Error)?.stack;
    InsertLogIntoDB(LogType.Error, args.map(String).join(" "), stack).catch(
      (err) => originalConsole.error("Failed to log error to DB:", err)
    );
  };

  console.info(`Started logging - branch ${process.env.BRANCH || "dev"} - uuid ${uuid}`);
}

export default { LogType, InsertLogIntoDB, overrideConsole };
