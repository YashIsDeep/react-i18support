import React from 'react';

function App() {
  return (
    <div className="App" id="parent">
      LANGUAGES:
      <div id="languagePreferenceButton">
        <input type="radio" id="englishOption" name="lang" value="en"/>
        <label for="englishOption">EN</label><br/>
        <input type="radio" id="germanOption" name="lang" value="de"/>
        <label for="germanOption">DE</label><br/>
        <input type="radio" id="russianOption" name="lang" value="ru"/>
        <label for="russianOption">RU</label><br/>
        <input type="radio" id="chineseOption" name="lang" value="ch"/>
        <label for="chineseOption">CH</label><br/>
        <input type="radio" id="japaneseOption" name="lang" value="jp"/>
        <label for="japaneseOption">JP</label><br/>
        <input type="radio" id="largeOption" name="lang" value="lg"/>
        <label for="largeOption">LargeJSON:5000</label><br/>
      </div>
      <br/>
      BUNDLES:
      <div id="bundlePreferenceButton">
        <input type="radio" id="op1" name="bundleOption" value="1"/>
        <label for="op1">1</label><br/>
        <input type="radio" id="op2" name="bundleOption" value="2"/>
        <label for="op2">2</label><br/>
        <input type="radio" id="op3" name="bundleOption" value="3"/>
        <label for="op3">3</label><br/>
        <input type="radio" id="op4" name="bundleOption" value="4"/>
        <label for="op4">4</label><br/>
        <input type="radio" id="op5" name="bundleOption" value="5"/>
        <label for="op5">5</label><br/>
      </div>
      <button id="publisher">
        Update
      </button>
      <div id="content">
      </div>
    </div>
  );
}

export default App;
