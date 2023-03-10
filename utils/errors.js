const { window }  = require('vscode');

const errorMessages = {
    noEditor: "Error: Editor not found! 😵",
    noEmail: "Error: Email is required! It is to protect us from unlimited use. We won't spam your email, promise. 🤝",
    noSelection: "Nothing selected. 😅",
    languageNotSupported: "Error: Language not supported yet! 😵",
    unableToConnect: "Error: Unable to connect to server! 💀",
    serverSentNothing: "Server sent nothing! 🙃",
};

const displayError = (error) => {
    return window.showErrorMessage(errorMessages[error]);
};


module.exports = {
    displayError
}