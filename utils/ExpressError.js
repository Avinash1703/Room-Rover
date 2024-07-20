class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

//exporting ExpressERRor class

module.exports = ExpressError;