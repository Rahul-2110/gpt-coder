const { Configuration, OpenAIApi } = require("openai");
const { displayError } = require('./utils/errors');
const { ExtensionContext, window, commands } = require('vscode');
const { styleAsComment } = require('./../utils/comments');


const key1 = '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'
const key2 = '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'

const config = new Configuration({
	apiKey: key1,
});

const openai = new OpenAIApi(config);

async function getSQLQueryFromSelection() {
    // The code you place here will be executed every time your command is executed
    const editor = window.activeTextEditor;
    if (!editor) return displayError("noEditor");

    // Aquire the selected text
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText.length) return displayError("noSelection");

    const lang = editor.document.languageId;

    const prompt = `generate sql query as per following description :\n ${selectedText}`;
    // Send the selected code and email to the API
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        if (!response.data) return displayError("serverSentNothing");

        // Get the output from the API response
        const output = response.data.choices[0].text.trim();

        // Wrap the output in a comment
        const comment = styleAsComment(output, lang);

        // Replace the selected text with the output
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.end, `\n${comment}`);
        });

        // Show the output in a message
        window.showInformationMessage(output)

    } catch (error) {
        console.error(error);
        return displayError("unableToConnect");
    }

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from gpt-coder!');
}

module.exports = {
    getSQLQueryFromSelection
}