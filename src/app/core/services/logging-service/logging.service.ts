import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RingBuffer } from 'ring-buffer-ts';

import { LogLevel } from './log-level.model';
import { LogMessage } from './log-message.model';
import { ConfigService } from '../config-service/config.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private _logLevel: LogLevel;
  private _logMessages: RingBuffer<LogMessage>;

  private logMessageBS = new Subject<LogMessage>();

  /**
   * Public Observable of the stream of log messages
   */
  logMessage$: Observable<LogMessage> = this.logMessageBS.asObservable(); 

  constructor(private configService: ConfigService) { 
    this._logMessages = new RingBuffer<LogMessage>(200);
    this._logLevel = LogLevel.Errors;
  }

  /**
   * Get the current log level
   * @returns LogLevel 
   */
  public get logLevel() {
    return this._logLevel;
  }

  /**
   * Get the log messages 
   * @returns An array of log messages up to the cache size 
   */
  public get logMessages() {
    return this._logMessages.toArray();
  }

  /**
   * Get the log message cache size
   */
  public get logMessageCacheSize() {
    return this._logMessages.getSize();
  }

  /**
   * 
   * @param logMessageCacheSize - number to set the log message cache size to - defaulted to 200
   */
  public set logMessageCacheSize(logMessageCacheSize: number) {
    this._logMessages.resize(logMessageCacheSize);
  }

  ngOnInit() {
    if(this.configService.logLevel) {
      this._logLevel = this.configService.logLevel;
    }
  }

  /**
   * Logs an error to the console if the log level is allowed
   * @param message 
   * @param origin 
   * @param optionalParams 
   */
  logError(message: any, origin?: string, ...optionalParams: any[]): void {
    if (origin === undefined) origin = LoggingService.getCallerName();
    this.log(message, LogLevel.Errors, origin, optionalParams);
  }
  
  /**
   * Logs a warning to the console if the log level is allowed
   * @param message 
   * @param origin 
   * @param optionalParams 
   */
  logWarning(message: any, origin?: string, ...optionalParams: any[]): void {
    if (origin === undefined) origin = LoggingService.getCallerName();
    this.log(message, LogLevel.Warnings, origin, optionalParams);
  }
  
  /**
   * * Logs an info to the console if the log level is allowed
   * @param message 
   * @param origin 
   * @param optionalParams 
   */
  logInfo(message: any, origin?: string, ...optionalParams: any[]): void {
    if (origin === undefined) origin = LoggingService.getCallerName();
    this.log(message, LogLevel.Info, origin, optionalParams);
  }
  
  /**
   * * Logs a verbose to the console if the log level is allowed
   * @param message 
   * @param origin 
   * @param optionalParams 
   */
  logVerbose(message: any, origin?: string, ...optionalParams: any[]): void {
    if (origin === undefined) origin = LoggingService.getCallerName();
    this.log(message, LogLevel.Verbose, origin, optionalParams);
  }

  /**
   * Logs the message to console and the ring buffer
   * @param message - message to log to console
   * @param level - level that caller wants to log at
   * @param origin - origin of the caller
   * @param extraParams 
   */
  private log(message: any, level: LogLevel = LogLevel.Warnings, origin: string, ...extraParams: any): void {
    if(this.shouldLog(level)) {
      const logMetadata: string = new Date().toUTCString() + " | " + LogLevel + " | " + origin;
      const logMessage: string = message.toString()
      const fullLogMessage: string = `${logMetadata} ${logMessage}`;
      switch (level) {
        case LogLevel.Errors:
          console.error(fullLogMessage, extraParams);
          break;
        case LogLevel.Warnings:
          console.warn(fullLogMessage, extraParams);
          break;
        case LogLevel.Info:
          console.info(fullLogMessage, extraParams);
          break;
        default:
          console.debug(fullLogMessage, extraParams);
      }
      this.postMessage(logMetadata, logMessage, extraParams);
    }
  }

  /**
   * Checks whether the caller should log based on current log level
   * @param level - the level to be checked against
   * @returns boolean 
   */
  private shouldLog(level: LogLevel): boolean {
    if (this._logLevel === LogLevel.None) {
      return false;
    } else if (this._logLevel === LogLevel.Errors) {
      return level === LogLevel.Errors;
    } else if (this._logLevel === LogLevel.Warnings) {
      return level === LogLevel.Errors || level === LogLevel.Warnings;
    } else if (this._logLevel === LogLevel.Info) {
      return level === LogLevel.Errors || level === LogLevel.Warnings || level === LogLevel.Info;
    } else {
      return true;
    }
  }

  /**
   * Tries to get the caller name by throwing an error and introspecting the stack trace
   * @return String of the caller name
   */
  private static getCallerName(): string {
    try {
      throw new Error();
    } catch(e) {
      try {
        return e.stack.split('at ')[3].split(' ')[0];
      } catch (e) {
        return '';
      }
    }
  }

  /***
   * Adds the log message to the ring buffer
   * @param metadata - string of meta data for log message
   * @param message - string of the log message
   * @param extraParams - extra params
   * @returns The full string added to the ring buffer
   */
  private postMessage(metadata: string, message: string, extraParams?: any): string {
    const logMessage: LogMessage = {metadata, message, extraParams};
    this._logMessages.add(logMessage);
    this.logMessageBS.next(logMessage);
    return `${metadata} ${message} ${extraParams}`;
  }

}
