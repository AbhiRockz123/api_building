
//error class which takes two fields :1)the error message being sent/auto generated and 2)the error statusCode being sent/auto generated
class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  
      // Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ErrorResponse;
        
