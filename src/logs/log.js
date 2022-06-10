const winston = require('winston')

dateFormat = () => {
  return new Date(Date.now()).toUTCString()
}
class LoggerService {
  constructor(route) {
    this.log_data = null
    this.route = route
    var curent_date=new Date();
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `../logs/log/${curent_date.getDate()}-${curent_date.getMonth()}-${curent_date.getFullYear()}.log`
        })
      ],
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
        message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
        message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
        return message
      })
    });
    this.logger = logger
  }
  setLogData(log_data) {
    this.log_data = log_data
  }
  async info(message) {
    this.logger.log('info', message);
  }
  async info(message, obj) {
    this.logger.log('info', message, {
      obj
    })
  }
  async debug(message) {
    this.logger.log('debug', message);
  }
  async debug(message, obj) {
    this.logger.log('debug', message, {
      obj
    })
  }
  async error(message) {
    this.logger.log('error', message);
  }
  async error(message, obj) {
    this.logger.log('error', message, {
      obj
    })
  }
}
/* const logger=new LoggerService("app");
logger.error("hello"); */
module.exports = LoggerService