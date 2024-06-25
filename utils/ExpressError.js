class ExpressError extends Error {    //This line defines a new class called ExpressError which extends the built-in Error class in JavaScript.
    constructor(statusCode,message) {
        super();  //The super() call invokes the constructor of the parent class (Error).
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;