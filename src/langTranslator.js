const PORT=9003;
const hostUrl='http://localhost:'+PORT;

class Translator
{
	constructor()
	{
		this.currentLanguage="";
		this.JSON={};
	}
	getLanguage()
	{
		return this.currentLanguage;
	}
	setLanguage(newLanguage)
	{
		if(this.currentLanguage===newLanguage)
			return new Promise((resolve,reject) => resolve());
		this.currentLanguage=newLanguage;
		if(newLanguage==="")
		{
			this.JSON={};
			return new Promise((resolve,reject) => resolve());
		}

		let filename=this.currentLanguage+".json";
		const setJsonFunction=function(json){
			this.JSON=json;
		}.bind(this);
		return new Promise(function(resolve,reject){
			fetch(hostUrl+'/locales/'+filename)
			.then( response => response.json())
			.then(setJsonFunction)
			.then(()=> resolve());
		});
	}
	getTranslateFunction()
	{
		return function(text){
			if(this.JSON[text]===undefined)
				return text;
			else
				return this.JSON[text];
		}.bind(this);
	}
}

export default new Translator();