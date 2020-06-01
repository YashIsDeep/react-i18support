import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18next from 'i18next'
import i18nextXHRBackend from 'i18next-xhr-backend';

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

function initRender()
{
  ReactDOM.render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

var funBuffer={};
let userLang='en'
function init(){
  i18next
    .use(i18nextXHRBackend)
    .init({
      lng:userLang,
      fallbackLng: 'en',
      debug: false,
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        // load from i18next-gitbook repo
        // Setup server in src/assets with python -m SimpleHTTPServer 8000
        loadPath: hostUrl+'/locales/{{lng}}.json',
        crossDomain: true
      }
    }, function(err, t){
    })
    .then(()=>{
      var end=Date.now();
      console.log('i18nNext took '+(end-start)+' ms.');
      window.i18next=i18next;
      initRender();
      var isRendered=false;
      var render;
      //Initial render done

      i18next.changeLanguage("lg")
        .then(()=>{
        //   console.log("START");
        //   var maxCount=10;
        //   var count,i;
        //   var N=400;
        //   for(count=1;count<=maxCount;count++)
        //   {
        //     var text;
        //     console.time("");
        //     for (i = 0; i < N; i++) { 
        //       text=i18next.t("Photo");
        //     }
        //     console.timeEnd("");
        //   }   
        //   console.log("END")
        // });
      const btn = document.getElementById('publisher');
      btn.addEventListener('click',function(){
        var selectedLanguagePreference=document.querySelector('input[name="lang"]:checked').value;
        var selectedBundlePreference=document.querySelector('input[name="bundleOption"]:checked').value;
        var start=Date.now();
        if(isRendered) document.getElementById('content').removeChild(render);
        i18next.changeLanguage(selectedLanguagePreference)
          .then(()=>{
            var mid=Date.now();
            $script(hostUrl+'/bundles/bundle'+selectedBundlePreference+'.js', () => {
              var end=Date.now();
              console.log("Update took "+(mid-start)+" ms to change language and "+(end-mid)+" ms to load bundle.");
              if(funBuffer[selectedBundlePreference]===undefined)funBuffer[selectedBundlePreference]=window.loadComponent;
              else window.loadComponent=funBuffer[selectedBundlePreference];
              var component=window.loadComponent();
              render=createElementFromString(component);
              document.getElementById('content').appendChild(render);
              isRendered=true;
            })
          });
      });
    });
}

init();

