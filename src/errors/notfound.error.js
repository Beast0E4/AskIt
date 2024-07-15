const BaseError = require('./base.error');
const { StatusCodes } = require('http-status-codes');

class NotFound extends BaseError {
    constructor(resourceName, resourceProperty){
        super("Not Found", StatusCodes.NOT_FOUND, `The requested resource: ${resourceName} with property ${resourceProperty} is not found`, {
            resourceName,
            resourceProperty
        });
    }
}

module.exports = NotFound;