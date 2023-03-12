
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { colors: [] };

    /** @type {Array<{ value: string }>} */
    let colors = oldState.colors;

    document.querySelector('#get-query').addEventListener('click', () => {
        const queryLanguage = document.getElementById("query-language").value;
        const queryPrompt = document.getElementById("query-prompt").value;   
        if(!queryLanguage.length){
            showError("Please enter target language");
        } 
        if(!queryPrompt.length){
            showError("Please enter a prompt");
        } 
        getQuery(queryLanguage, queryPrompt);
       
    });


    document.querySelector('#explain-query-btn').addEventListener('click', () => {
        const explainLanguage = document.getElementById("explain-language").value;
        const query = document.getElementById("explain-query").value;   
        if(!explainLanguage.length){
            showError("Please enter target language");
        } 
        if(!query.length){
            showError("Please enter a query");
        } 
        getQueryExplanation(explainLanguage, query);
       
    });

    document.querySelector('#translate-query').addEventListener('click', () => {
        const queryLanguage1 = document.getElementById("query-language-1").value;
        const queryLanguage2 = document.getElementById("query-language-2").value;
        const queryPrompt = document.getElementById("query-prompt-2").value;   

        if(!queryLanguage1.length){
            showError("Please enter source lanuage");
        }
        if(!queryLanguage2.length){
            showError("Please enter target lanuage");
        }
        if(!queryPrompt.length){
            showError("Please enter a query");
        } 
        translateQuery(queryLanguage1, queryLanguage2, queryPrompt);
       
    });

    function translateQuery(queryLanguage1, queryLanguage2, queryPrompt) {
        vscode.postMessage({ type: 'queryTranslate', language1: queryLanguage1, language2: queryLanguage2, prompt: queryPrompt});
    }

    function getQuery(queryLanguage, queryPrompt) {
        vscode.postMessage({ type: 'getQuery', language: queryLanguage,  prompt: queryPrompt});
    }

    function showError(error) {
        vscode.postMessage({ type: 'showError', value: error });
    }

    function getQueryExplanation(explainLanguage, query){
        vscode.postMessage({ type: 'explainQuery', language: explainLanguage,  query: query});
    }


}());


