import {StatusCodes} from "http-status-codes"


export class BadRequestError extends Error {
    constructor(message){
        super(message)
        this.name = "BadRequestError",
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}


export  class unAuthorizedError extends Error {

  constructor(message){
        super(message)
        this.name = "unAuthorizedError",
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export  class unAuthenticatedError extends Error {

    constructor(message){
          super(message)
          this.name = "unAuthenticated",
          this.statusCode = StatusCodes.FORBIDDEN
      }
  }