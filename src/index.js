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

function func(){
  i18next
    .use(i18nextXHRBackend)
    .init({
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
              var component=window.loadComponent();
              render=createElementFromString(component);
              document.getElementById('content').appendChild(render);
              isRendered=true;
            })
          });
      });
    });
}

func();