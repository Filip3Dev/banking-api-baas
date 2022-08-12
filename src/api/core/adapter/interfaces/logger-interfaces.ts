export interface Logger {
  fatal(message: unknown): void
  error(message: unknown): void
  warn(message: unknown): void
  info(message: unknown): void
  debug(message: unknown): void
  trace(message: unknown): void
}
