const BaseError = require('./base.error');
const { StatusCodes } = require('http-status-codes');

class NotImplemented extends BaseError {
    constructor(methodName){
        super("Not Implemeneted", StatusCodes.NOT_IMPLEMENTED, `${methodName} not implemented`, {});
    }
}

module.exports = NotImplemented;