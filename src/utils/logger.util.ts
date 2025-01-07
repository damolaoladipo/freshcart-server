import { LoggerDataDTO } from "../dtos/system.dto";
import colors from "colors";

/**
 * @name log;
 * @description logs  a message to the console
 * @param { LoggerDataDTO } payload - see LogRequestDTO
 * @returns { void } - void
 */
class Logger {
  constructor() {}
  public log(payload: LoggerDataDTO) {
    const { label, data, type } = payload;
    if (data) {
      if (label) {
        console.log(label);
      }
      if (typeof data === "string") {
        if (type) {
          if (type === "error") {
            console.error(colors.red(data));
          } else if (type === "success") {
            console.log(colors.green(data));
          } else if (type === "warning") {
            console.log(colors.yellow(data));
          } else if (type === "info") {
            console.log(colors.blue(data));
          }
        } else {
          console.log(data);
        }
      } else {
        console.log(data);
      }
    }
  }
}

export default new Logger();
