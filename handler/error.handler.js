function errorHandler(error, name, from) {
    let loggerFunction = console.log;

    loggerFunction("__________START__________");
    loggerFunction("Error occured in " + name);

    if (from === "axios") {
        if (error.response) {
            // The request was made and the server responded with a status
            // that fall out of the range of 2xx
            loggerFunction(error.response.data);
            loggerFunction(error.response.status);
            loggerFunction(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // error.request is an instance of XMLHttpRequest in the browser
            // http.ClientRequest in node.js
            loggerFunction(error.request);
        } else {
            // Something happened in setting up the request that triggered
            loggerFunction("Error", error.message);
        }
        loggerFunction(error.toJSON());
    } else {
        loggerFunction(error);
    }

    loggerFunction("__________END__________");
}

module.exports = {
    errorHandler,
};