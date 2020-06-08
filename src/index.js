import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createIntl, createIntlCache, RawIntlProvider,FormattedMessage} from 'react-intl';

var $script = require('scriptjs');
const PORT=9003;
const hostUrl='http://localhost:'+PORT;
var start=Date.now();

function createElementFromString(str)
{
  const element=document.createElement('div');
  element.innerHTML=str;
  return element;
}

function timeLogger()
{
  console.log("START",window.intl.locale,window.__("PhotoKey"));
  var maxCount=10;
  var count,i;
  var N=400;
  for(count=1;count<=maxCount;count++)
  {
    var text;
    console.time("");
    for (i = 0; i < N; i++) { 
      text=window.__("PhotoKey");
    }
    console.timeEnd("");
  }   
  console.log("END")
}

function initRender()
{
  ReactDOM.render(
    <RawIntlProvider value={window.intl}>
      <FormattedMessage id="Welcome" values={{name:"Stranger"}} />
      <br />
      <React.StrictMode>
        <App></App>
      </React.StrictMode>
    </RawIntlProvider>,
      document.getElementById('root')
  );
}

function loadPage()
{
  var end=Date.now();
  console.log('react-intl took '+(end-start)+' ms.');
  initRender();
  var isRendered=false;
  var render;
  //Initial render done

  //Time logging function
  window.changeLanguage("lg").then(timeLogger);

  var funBuffer={};
  const btn = document.getElementById('publisher');
  btn.addEventListener('click',function(){
    var selectedLanguagePreference=document.querySelector('input[name="lang"]:checked').value;
    var selectedBundlePreference=document.querySelector('input[name="bundleOption"]:checked').value;
    var start=Date.now();
    if(isRendered) document.getElementById('content').removeChild(render);
    window.changeLanguage(selectedLanguagePreference)
      .then(()=>{
        var mid=Date.now();
        $script(hostUrl+'/bundles/bundle'+selectedBundlePreference+'.js', () => {
          var end=Date.now();
          console.log("Update took "+(mid-start)+" ms to change language and "+(end-mid)+" ms to load bundle.");

          if(funBuffer[selectedBundlePreference]===undefined)funBuffer[selectedBundlePreference]=window.loadComponent;
          var loader = funBuffer[selectedBundlePreference];
          
          var component=loader();
          render=createElementFromString(component);
          document.getElementById('content').appendChild(render);
          isRendered=true;
        })
      });
  });
}

// intl.formatMessage

function setupLanguageLibrary(userLang){
  const cache=createIntlCache();
  window.__=function(str){
    //console.log("Format request for "+str)
    return window.intl.formatMessage({id:str});
  }
  window.changeLanguage=function(newLocale){
    return new Promise( function(resolve,reject){
      import(  /* webpackMode: "lazy" */ './assets/locales/'+newLocale+'.js')
        .then(messages=>{
          //console.log(newLocale);
          //console.log(messages.default);
          var intl = createIntl(
            {locale: newLocale, messages: messages.default},
            cache
          );
          window.intl=intl;
          resolve();
        });
    });
  };
  return new Promise( function(resolve,reject){
    import(  /* webpackMode: "lazy" */ './assets/locales/'+userLang+'.js')
      .then(messages=>{
        console.log(messages.default);
        var intl = createIntl({
          locale: userLang, messages: messages.default},
          cache
        );
        window.intl=intl;
        resolve();
      });
  });
}




let userLanguage='jp'
setupLanguageLibrary(userLanguage).then(loadPage);


// Number formatting. 
// D