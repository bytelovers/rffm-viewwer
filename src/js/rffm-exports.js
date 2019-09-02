(function() {

  if (!window.rffm) { throw 'RFFM is not present'; }

  const headers = ['Local', '&nbsp;', 'Visitante', 'Campo', 'Fecha'];

  const formatDate = date => {
      const _date = date.toISOString().split('T')[0].split('-').reverse().join('-');
      const _time = [
          date.getHours().toString().padStart(2, '0'),
          date.getMinutes().toString().padStart(2, '0')
      ].join(':');
      return `${_date} ${_time}`;
  }

  const createObjTable = () => {
      return window.rffm.getMatches()
          .map(match => {
              return {
                  [headers[0]]: match.local.name,
                  [headers[1]]: match.result ? match.result : '',
                  [headers[2]]: match.visitor.name,
                  [headers[3]]: match.place.name,
                  [headers[4]]: match.place.time ? formatDate(match.place.time) : '-'
              }
          });
  }

  const exportToTable = () => {
      const createCell = (data, tag) => `<${tag}>${data}</${tag}>`;
      return `
          <table>
              <tr>${ headers.map(header => createCell(header, 'th')).join('') }</tr>
              ${ createObjTable().map(row => `
                  <tr>
                      ${ Object.values(row).map(cell => createCell(cell, 'td')).join('') }
                  </tr>`).join('')
              }
          </table>
      `;
  };

  const printTable = () => {
      console.table(createObjTable());
  }

  const exportToCSV = (delimiter = '|') => {
      const table = createObjTable();
      return table.map((row, i) => {
          const newLine = '\r\n';
          let _row = '';

          if (i === 0) _row += headers.join(delimiter) + newLine;
          return _row += Object.values(row).join(delimiter)+ newLine;
      }).join('');
  }

  const saveFile = (data, filename = 'export', type = 'csv') => {
      const exportedFilenmae = `${filename}.${type}`;

      const blob = new Blob([data], { type: `text/${type};charset=utf-8;` });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", exportedFilenmae);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
  }

  const saveCSVToFile = (filename = 'export', delimitter) => saveFile(exportToCSV(delimitter), filename, 'csv');
  const saveHTMLtoFile = (filename = 'export') => saveFile(exportToTable(), filename, 'html');

  window.rffm = Object.assign({},
      window.rffm,
      {
          exportToHTMLTable: exportToTable,
          exportToJson: createObjTable,
          exportToCSV,
          printTable,
          saveCSVToFile,
          saveHTMLtoFile
      }
  );

})()