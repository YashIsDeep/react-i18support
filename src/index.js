import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18next from 'i18next'
import i18nextXHRBackend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { useTranslation,withTranslation,Translation,Trans } from 'react-i18next';

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
  console.log("START");
  var maxCount=10;
  var count,i;
  var N=400;
  for(count=1;count<=maxCount;count++)
  {
    var text;
    console.time("");
    for (i = 0; i < N; i++) { 
      text=i18next.t("Photo");
    }
    console.timeEnd("");
  }   
  console.log("END")
}

function initRender()
{
  ReactDOM.render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

function loadPage()
{
  var end=Date.now();
  console.log('i18nNext took '+(end-start)+' ms.');
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

function setupLanguageLibrary(userLang){
  return i18next
    .use(i18nextXHRBackend)
    .use(initReactI18next)
    .init({
      lng:userLang,
      fallbackLng: 'en',
      backend: {
        // Setup server in src/assets with python server.py
        loadPath: hostUrl+'/locales/{{lng}}.json',
        crossDomain: true
      }
    }, function(err, t){
    })
    .then(()=>{
      window.__=i18next.getFixedT()
      window.changeLanguage=i18next.changeLanguage.bind(i18next);
    }); 
}




let userLanguage='en'
setupLanguageLibrary(userLanguage).then(loadPage);