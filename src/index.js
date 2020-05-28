import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18next from 'i18next'
import i18nextXHRBackend from 'i18next-xhr-backend';
import lodash from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import _merge from 'lodash/merge';
import _sortBy from 'lodash/sortBy';
import _keys from 'lodash/keys';
window._merge=_merge;
window._sortBy=_sortBy;
window._keys=_keys;

var $script = require('scriptjs');
const PORT=8005;
//var start=Date.now();
window.React = React;
window.classnames = classnames;
window.lodash = lodash;
window.reactDOM = ReactDOM;
window.moment = moment;

function func(){
  i18next
    .use(i18nextXHRBackend)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        // load from i18next-gitbook repo
        // Setup server in src/assets with python -m SimpleHTTPServer 8000
        loadPath: 'http://localhost:'+PORT+'/{{lng}}.json',
        crossDomain: true
      }
    }, function(err, t){
    })
    .then(()=>{
      //var end=Date.now();
      //console.log('i18nNext took '+(end-start)+' ms.');
      i18next.changeLanguage("en");
      global.i18next=i18next;
      let promise= new Promise(function(resolve,reject){
        $script("http://localhost:"+PORT+"/bundle3.js",() => {
          // var tools=require('tempBundle.js');
          // console.log(tools);
          console.log(window);
          //let tmp=getInspectedProps(window.MySpxComponent.propTypes,window.MySpxComponent.propSettings);
          //console.log("tmp:",tmp);
          resolve(window.MySpxComponent);
        });
      });
  	  promise.then(result => {
        console.log(result);
        ReactDOM.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
          document.getElementById('root')
        );
      });
    });
}

func();