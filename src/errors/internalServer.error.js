const BaseError = require('./base.error');
const { StatusCodes } = require('http-status-codes');

class InternalServerError extends BaseError {
    constructor(details){
        super("Internal Server Eror", StatusCodes.InternalServerError, `Something went wrong`, details);
    }
}

module.exports = InternalServerError;