This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Utilities 

Run a python server on localhost using the server.py file in ./src/assets

### `python server.py`

If you already have a remote server hosted, you can save it's URL in the 'hostUrl' and 'Port' vairables to achieve the same functionality. 

### How to mark the strings to be translated

The '\_\_' function must be wrapped around the strings that need to be translated.

## INTEGRATION into your code

To incorporate into your code, first install the dependencies via:
### `npm i i18next i18next-http-backend --save`

Now, import the two libraries 'i18next' and 'i18next-http-backend'.

Use the setupLanguageLibrary(userLanguage) function to get a promise which resolves when the initial batch of translations gets loaded. When the promise resolves, you can load the components where the '\_\_' function has to be executed. The configuration options currently are configured for vanilla translation code but may be modfied as needed. 

## Extra functionality for namespacing

If you wish to seperate out your translations into multiple JSON files, you might want to use the functionality of loadNamespaceToMain. This function appends the translations of the required namespace into the main bundle. 
## NOTE: ## 
### This is not the only way. The other way to use namespacing would be to not append the translations to the main file but to either use the namespaceSeperator or switch the default namespaces.
