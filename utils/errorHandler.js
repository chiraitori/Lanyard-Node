module.exports = {
    handleError: function (message, error, logger, userMessage = 'There was an error executing that command.') {
        logger.error(error);
        message.reply(userMessage);
    }
};
