import { Request, Response, NextFunction } from 'express'
import { isErrorResponse } from './errorResponse';


type ErrorHandlerFunction = <E extends Error>(err: E, req: Request, res: Response, next: NextFunction) => void

export const notFoundErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (isErrorResponse(err) && err.httpStatusCode === 404) {
    res.status(404).send(err.message || "Error not found!");
  } else {
    next(err);
  }
};

export const badRequestErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (isErrorResponse(err) && err.httpStatusCode === 400) {
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};

export const unauthorizedErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
    if (isErrorResponse(err) && err.httpStatusCode === 403) {
      res.status(401).send("Unauthorized!");
    } else {
      next(err);
    }
  };

export const forbiddenErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (isErrorResponse(err) && err.httpStatusCode === 403) {
    res.status(403).send("Forbidden!");
  } else {
    next(err);
  }
};

export const catchAllErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  res.status(500).send("Generic Server Error");
};