var $script = require('scriptjs');
const PORT=9003;
const hostUrl='http://localhost:'+PORT;
module.exports= 
class Translator
{
	constructor()
	{
		this.currentLanguage="en";
		this.JSON={};
		this.setJSONfunction=()=>{};
	}
	getLanguage()
	{
		return this.currentLanguage;
	}
	setLanguage(str)
	{
		this.currentLanguage=str;
		let filename=this.currentLanguage+".js";
		console.log("Fetching "+filename);
		return new Promise(function(resolve,reject){
			$script(hostUrl+'/locales/'+filename, () => {
				window.translator.setJSONfunction();
				resolve();
			});
		});
	}
	//_translator.parseText("string");
	parseText(text) // Case sensitive
	{
		if(this.JSON[text]===undefined)
			return text;
		else
			return this.JSON[text];
	}
}