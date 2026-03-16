type LogLevel = "info" | "warn" | "error" | "debug" | "success";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Background colors
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

// Color mappings for log levels
const levelColors: Record<LogLevel, { color: string; icon: string }> = {
  error: { color: colors.bright + colors.red, icon: "❌" },
  warn: { color: colors.bright + colors.yellow, icon: "⚠️" },
  info: { color: colors.bright + colors.blue, icon: "ℹ️" },
  debug: { color: colors.cyan, icon: "🔍" },
  success: { color: colors.bright + colors.green, icon: "✅" },
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      success: 1,
      warn: 2,
      error: 3,
    };

    const currentLevel =
      (process.env.LOG_LEVEL as LogLevel) ||
      (process.env.NODE_ENV === "production" ? "info" : "debug");
    return logLevels[level] >= logLevels[currentLevel as LogLevel];
  }

  private colorize(text: string, color: string): string {
    // Disable colors in production or if explicitly disabled
    if (process.env.NODE_ENV === "production" || process.env.NO_COLOR === "1") {
      return text;
    }
    return `${color}${text}${colors.reset}`;
  }

  private formatEntry(entry: LogEntry): string {
    const { color, icon } = levelColors[entry.level];

    // Format timestamp
    const timestamp = this.colorize(entry.timestamp, colors.gray);

    // Format level with icon and color
    const level = this.colorize(`[${entry.level.toUpperCase()}] ${icon}`, color);

    // Format message
    const message = this.colorize(entry.message, colors.white);

    // Format meta if present
    let metaString = "";
    if (entry.meta) {
      const metaJson = JSON.stringify(entry.meta, null, 2);
      metaString = this.colorize(`\n${metaJson}`, colors.dim);
    }

    return `${timestamp} ${level} ${message}${metaString}`;
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };

    const formatted = this.formatEntry(entry);

    // Use appropriate console method
    switch (level) {
      case "error":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log("debug", message, meta);
  }

  success(message: string, meta?: Record<string, unknown>): void {
    this.log("success", message, meta);
  }
}

export const logger = new Logger();
export default logger;
