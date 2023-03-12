<template>
    <div>
        <div class="container">
            <h3>Query Generator</h3>

            <div class="query">
                <label class="input" for="query-language">Language</label><br>
                <input class="input" type="text" v-model="queryLanguage">

                <label class="label" for="query-prompt">Prompt</label><br>
                <input class="input" type="text"  v-model="queryPrompt">

                <button class="button" @click="generateQuery">Generate Query</button>
            </div>

        </div>

        <hr>
        <div class="container">
            <h3>Query Translator</h3>

            <div class="query">
                <label class="input" for="query-language-1">From language</label><br>
                <input class="input" type="text" v-model="queryLanguageFrom">

                <label class="label" for="query-language-2">To language</label><br>
                <input class="input" type="text" v-model="queryLanguageTo">

                <label class="label" for="query-prompt-2">Prompt</label><br>
                <input class="input" type="text" v-model="queryPrompt">

                <button @click="tanslateQuery" class="button">Translate Query</button>
            </div>

        </div>

        <hr>
        <div class="container">
            <h3>Query Explainer</h3>

            <div class="query">
                <label class="input" for="explain-language">Language</label><br>
                <input class="input" type="text" v-model="explainLanguage">

                <label class="label" for="explain-query">Query</label><br>
                <input class="input" type="text" v-model="queryToExplain">

                <button @click="explainQuery" class="button">Explain Query</button>
            </div>

        </div>
    </div>
</template>

<script>
const vscode = acquireVsCodeApi();
export default {
    name: 'QueryGenerator',
    data() {
        return {
            queryLanguage: '',
            queryPrompt: '',
            queryLanguageFrom: '',
            queryLanguageTo: '',
            queryPrompt: '',
            explainLanguage: '',
            queryToExplain: ''
        }
    },
    methods: {
        generateQuery(){  
            if(!this.queryLanguage.trim().length){
                thsi.showError("Please enter target language");
            } 
            if(!this.queryPrompt.trim().length){
                this.showError("Please enter a prompt");
            } 
            console.log("done this")
            vscode.postMessage({ type: 'getQuery', language: this.queryLanguage.trim(),  prompt: this.queryPrompt.trim()});
        },
        tanslateQuery(){
            if(!this.queryLanguageFrom.trim().length){
                this.showError("Please enter source lanuage");
            }
            if(!this.queryLanguageTo.trim().length){
                this.showError("Please enter target lanuage");
            }
            if(!this.queryPrompt.trim().length){
                this.showError("Please enter a query");
            } 
            vscode.postMessage({ type: 'queryTranslate', language1: this.queryLanguageFrom.trim(), language2: this.queryLanguageTo.trim(), prompt: this.queryPrompt.trim()});
        },
        explainQuery(){
            if(!this.explainLanguage.trim().length){
                this.showError("Please enter target language");
            } 
            if(!this.queryToExplain.trim().length){
                this.showError("Please enter a query");
            } 
            vscode.postMessage({ type: 'explainQuery', language: this.explainLanguage.trim(),  query: this.queryToExplain.trim()});
        },
        showError(){
            vscode.postMessage({ type: 'showError', value: error });
        }
    }

}
</script>

<style scoped>
.container {
    text-align: center;
    margin: 20px;
}

.input {
    margin: 5px;
    border-radius: 5px;
}

.label {
    margin: 5px;
    border-radius: 5px;
}

.query {
    padding: 10px;
}

.query-input {
    margin-top: 10px;
}

.button {
    margin-top: 15px;
    padding: 5px;
    border-radius: 5px;
    display: inline-block;
    max-width: 50%;
}
</style>>