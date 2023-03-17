const path = require("path");
const fs = require("fs");
const { APP_CONFIG } = require("../../config/app-config");
const winston = require("winston");
require("winston-daily-rotate-file");

/**
 * @description Example:   Logger.debug ("debug", "error", ["debug 3"], {key: "value"}, "and many parameters")
 */
const formatFunction = winston.format.printf(({ level, timestamp, ms, message, ...rest }) => {
	const args = rest[Symbol.for("splat")];
	const outMessage = [message, args].map(JSON.stringify).join(" ");

	return `[${timestamp}] : [${level}] : ${outMessage} ${ms}`;
});

const format = winston.format.combine(winston.format.timestamp(), winston.format.ms(), formatFunction);

// Base on config, we'll indicate the destination that the logger will write to: console or file system
const logTransports = [];

if (APP_CONFIG.logDriver === "file") {
	const logDirectory = path.join(__dirname, "../../logs");
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	const FileTransport = new winston.transports.DailyRotateFile({
		filename: "log-%DATE%",
		extension: ".log",
		dirname: logDirectory,
		datePattern: "YYYY-MM-DD",
		maxSize: "20m",
		maxFiles: "30d",
	});
	logTransports.push(FileTransport);
}

if (APP_CONFIG.logDriver === "console") {
	const ConsoleTransport = new winston.transports.Console();
	logTransports.push(ConsoleTransport);
}

const Logger = winston.createLogger({
	transports: logTransports,
	format,
	level: APP_CONFIG.logLevel,
});

module.exports = {
	Logger,
};
