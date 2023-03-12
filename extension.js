// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { Configuration, OpenAIApi } = require("openai");
const { displayError } = require('./utils/errors');
const { ExtensionContext, window, commands } = require('vscode');
const { styleAsComment } = require('./utils/comments');

const key1 = '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'
const key2 = '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'

const config = new Configuration({
	apiKey: key1,
});

const openai = new OpenAIApi(config);

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gpt-coder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json


	context.subscriptions.push(vscode.commands.registerCommand('gpt-coder.getQuery', async function () {
		// The code you place here will be executed every time your command is executed
		const editor = window.activeTextEditor;
		if (!editor) return displayError("noEditor");

		const language = await vscode.window.showInputBox({
			placeHolder: "Language",
			prompt: "Generate a query for a language"
		  });
		  
		if (!language.length) return displayError("Please enter target language");
		
		const prompt = await vscode.window.showInputBox({
			placeHolder: "Query Explanation",
			prompt: "Generate a query for"
		  });

		if (!prompt.length) return displayError("Please enter a prompt to generate a query");

		// Aquire the selected text
		const selection = editor.selection;
		// const selectedText = editor.document.getText(selection);
		

		const lang = editor.document.languageId;

		try {
			const comment = styleAsComment(await getChatGPTAnswer(getPromptForQuery(prompt,language)), lang);
			// Replace the selected text with the output
			editor.edit((editBuilder) => {
				editBuilder.insert(selection.end, `\n${comment}`);
			});

			// Show the output in a message
			window.showInformationMessage(comment)

		} catch (error) {
			console.error(error);
			return displayError("unableToConnect");
		}

	}));


	context.subscriptions.push(vscode.commands.registerCommand('gpt-coder.explainQuery', async function () {
		// The code you place here will be executed every time your command is executed
		const editor = window.activeTextEditor;
		if (!editor) return displayError("noEditor");

		const language = await vscode.window.showInputBox({
			placeHolder: "Language",
			prompt: "Explain a query for a language"
		  });
		  
		if (!language.length) return displayError("Please enter the query language");
		
		const query = await vscode.window.showInputBox({
			placeHolder: "Query for explanation",
			prompt: "Query"
		  });

		if (!query.length) return displayError("Please enter a query");

		// Aquire the selected text
		const selection = editor.selection;
		// const selectedText = editor.document.getText(selection);
		

		const lang = editor.document.languageId;

		try {
			const comment = styleAsComment(await getChatGPTAnswer(getPromptForQueryExplain(language, query)), lang);
			// Replace the selected text with the output
			editor.edit((editBuilder) => {
				editBuilder.insert(selection.end, `\n${comment}`);
			});

			// Show the output in a message
			window.showInformationMessage(comment)

		} catch (error) {
			console.error(error);
			return displayError("unableToConnect");
		}
		
	}));

	context.subscriptions.push(vscode.commands.registerCommand('gpt-coder.translateQuery', async function () {
		// The code you place here will be executed every time your command is executed
		const editor = window.activeTextEditor;
		if (!editor) return displayError("noEditor");

		const language1 = await vscode.window.showInputBox({
			placeHolder: "From language",
			prompt: "Query language"
		  });
		
		if (!language1.length) return displayError("Please enter the query language");

		const language2 = await vscode.window.showInputBox({
			placeHolder: "To language",
			prompt: "To query language"
		});

		if (!language2.length) return displayError("Please enter the language");

		const query = await vscode.window.showInputBox({
			placeHolder: "Query",
			prompt: "Query to Translate"
		});

		if (!query.length) return displayError("Please enter the query");
		

		// Aquire the selected text
		const selection = editor.selection;
		// const selectedText = editor.document.getText(selection);
		

		const lang = editor.document.languageId;

		try {
			const comment = styleAsComment(await getChatGPTAnswer(getPromptForTranslate(language1,language2, query)), lang);
			// Replace the selected text with the output
			editor.edit((editBuilder) => {
				editBuilder.insert(selection.end, `\n${comment}`);
			});

			// Show the output in a message
			window.showInformationMessage(comment)

		} catch (error) {
			console.error(error);
			return displayError("unableToConnect");
		}
		
	}));



	const provider = new ColorsViewProvider(context.extensionUri);

    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));

}

class ColorsViewProvider {

    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }

    async resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
				case 'getQuery':
					{	
						// vscode.window.activeTextEditor?.insert(selection.end, new vscode.SnippetString(`#${data.value}`));
						if(!data.language.trim()){
							vscode.window.showErrorMessage("Please enter target lanuage");
						}
						else if(!data.prompt.trim()){
							vscode.window.showErrorMessage("Please enter a prompt");
						}
						else{
							const editor = vscode.window.activeTextEditor;
							const selection = editor.selection;
							const lang = editor.document.languageId;
							if (!editor) return displayError("noEditor");
							try{
								const comment = styleAsComment(await getChatGPTAnswer(getPromptForQuery(data.language, data.prompt)), lang);
							}catch(err){
								console.log(err)
							}
							
							editor.edit((editBuilder) => {
								editBuilder.insert(selection.end, `\n${comment}`);
							});
							window.showInformationMessage(comment)
						}
						break;
					}
				case 'explainQuery':
					{	
						// vscode.window.activeTextEditor?.insert(selection.end, new vscode.SnippetString(`#${data.value}`));
						if(!data.language.trim()){
							vscode.window.showErrorMessage("Please enter lanuage");
						}
						else if(!data.query.trim()){
							vscode.window.showErrorMessage("Please enter a query");
						}
						else{
							const editor = vscode.window.activeTextEditor;
							const selection = editor.selection;
							const lang = editor.document.languageId;
							if (!editor) return displayError("noEditor");
							const comment = styleAsComment(await getChatGPTAnswer(getPromptForQueryExplain(data.language, data.query)), lang);
							editor.edit((editBuilder) => {
								editBuilder.insert(selection.end, `\n${comment}`);
							});
							window.showInformationMessage(comment)
						}
						break;
					}
				case 'queryTranslate':
					{	
						// vscode.window.activeTextEditor?.insert(selection.end, new vscode.SnippetString(`#${data.value}`));
						if(!data.language1.trim()){
							vscode.window.showErrorMessage("Please enter source lanuage");
						}
						if(!data.language2.trim()){
							vscode.window.showErrorMessage("Please enter target lanuage");
						}
						else if(!data.prompt.trim()){
							vscode.window.showErrorMessage("Please enter a prompt");
						}
						else{
							const editor = vscode.window.activeTextEditor;
							const selection = editor.selection;
							const lang = editor.document.languageId;
							if (!editor) return displayError("noEditor");
							const comment = styleAsComment(await getChatGPTAnswer(getPromptForTranslate(data.language1, data.language2, data.prompt)), lang);
							editor.edit((editBuilder) => {
								editBuilder.insert(selection.end, `\n${comment}`);
							});
							window.showInformationMessage(comment)
						}
						break;
					}
				case 'showError':
					{	
						vscode.window.showErrorMessage(data.value);
						break;
					}
            }
        });
    }


    _getHtmlForWebview(webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'main.js'));
		const scriptUri2 = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        // Do the same for the stylesheet.
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'main.css'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>GPT CODER</title>
			</head>
			<body>

				<div id="app"></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}" src="${scriptUri2}"></script>
			</body>
			</html>`;
    }
}


ColorsViewProvider.viewType = 'gpt-coder.colorsView';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getPromptForQuery(prompt, language='sql'){
	return `generate ${language} query for ${prompt}`;
}

function getPromptForTranslate(from, to, query){
	return `generate ${to} equivalent query of ${from} query "${query}"`;
}
function getPromptForQueryExplain(language, query){
	return `explain ${language} query "${query}"`;
}
async function getChatGPTAnswer(prompt){
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
	return response.data.choices[0].text.trim();
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
