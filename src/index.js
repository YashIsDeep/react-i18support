import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend';

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
  console.log("END",text)
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
  //window.changeLanguage("lg").then(timeLogger);

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
    .use(HttpBackend)
    .init({
      lng:userLang,
      fallbackLng: false,
      keySeparator: false,
      nsSeparator: false,
      skipInterpolation: true,
      simplifyPluralSuffix: false,
      ns: ["main"],
      defaultNS: "main",
      backend: {
        // Setup server in src/assets with python server.py
        loadPath: hostUrl+'/locales/{{lng}}/{{ns}}.json',
        crossDomain: true
      }
    }, function(err, t){
    })
    .then(()=>{
      window.__=i18next.getFixedT()
      window.changeLanguage=i18next.changeLanguage.bind(i18next);
      window.__language=userLang;
    }); 
}




let userLanguage='en'
setupLanguageLibrary(userLanguage)
  .then(loadPage)
  .then(()=>{
    //console.log("Before Loading",i18next.getResourceBundle(window.__language,"main"))
    loadNamespaceToMain("side")
  });


function loadNamespaceFromBackend(ns)
{
  if(!i18next.hasResourceBundle(window.__language,ns))
  { 
    let promise=i18next.loadNamespaces(ns);
    return promise;
  }
  else
    return new Promise((resolve,reject)=> resolve());
}
function loadNamespaceToMain(ns)
{
  return loadNamespaceFromBackend(ns).then(()=>{
      let resources=i18next.getResourceBundle(window.__language,ns);
      i18next.addResourceBundle(window.__language,"main",resources,true,false);
    });
}