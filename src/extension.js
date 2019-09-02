(function(){
  const btnRequest = document.getElementById('requestdata');
  const btnActionExportCSV = document.getElementById('exportcsv');
  const btnActionExportHTML = document.getElementById('exporthtml');
  const btnActionPrintTable = document.getElementById('printtable');
  
  let tabParams = {
    active: true,
    currentWindow: true
  };

  const executeCode = (sentence, cb) => {
    chrome.tabs.query(tabParams, tabs => {
      const { id: tabId } = tabs[0];
      chrome.tabs.executeScript(tabId, {
        code: sentence
      }, cb);
    });
  }
  
  btnRequest.onclick = () => {
    const onCodeExecuted = data => {
      document.getElementById('tableResults').innerHTML = data[0];
    };
    executeCode('rffm.exportToHTMLTable()', onCodeExecuted);
  }
  
  btnActionExportCSV.onclick = () => {
    const onCodeExecuted = () => {};
    executeCode('rffm.saveCSVToFile()', onCodeExecuted);
  }
  
  
  btnActionExportHTML.onclick = () => {
    const onCodeExecuted = () => {};
    executeCode('rffm.saveHTMLToFile()', onCodeExecuted);
  }
  
  btnActionPrintTable.onclick = () => {
    const onCodeExecuted = () => {};
    executeCode('rffm.printTable()', onCodeExecuted);
  }
})();