import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Translator from './langTranslator.js';

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
      text=window.__("Photo");
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


function setupLanguage(userLang)
{ 
  window.__=Translator.getTranslateFunction();
  window.changeLanguage=Translator.setLanguage.bind(Translator);
  return Translator.setLanguage(userLang);
}

function loadPage()
{
  var end=Date.now();
  console.log("Initial setup time: "+(end-start)+ " ms.");
  initRender();
  var isRendered=false;
  var render;
  //Initial render done

  window.changeLanguage("lg").then(timeLogger);

  var bundleBuffer={};
  const btn = document.getElementById('publisher');
  btn.addEventListener('click',function(){
    var selectedLanguagePreference=document.querySelector('input[name="lang"]:checked').value;
    var selectedBundlePreference=document.querySelector('input[name="bundleOption"]:checked').value;
    if(isRendered) document.getElementById('content').removeChild(render);

    var start=Date.now();
    window.changeLanguage(selectedLanguagePreference)
      .then(()=>{
        var mid=Date.now();
        $script(hostUrl+'/bundles/bundle'+selectedBundlePreference+'.js', () => {
          var end=Date.now();
          console.log("Update took "+(mid-start)+" ms to change language and "+(end-mid)+" ms to load bundle.");

          if(bundleBuffer[selectedBundlePreference]===undefined)bundleBuffer[selectedBundlePreference]=window.loadComponent;
          var loader=bundleBuffer[selectedBundlePreference];
          
          var component=loader();
          render=createElementFromString(component);
          document.getElementById('content').appendChild(render);
          isRendered=true;
        })
      });
  });
}




let userLanguage='en'
setupLanguage(userLanguage).then(loadPage);