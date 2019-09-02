(function(document) {

  const SELECTORS = {
    MATCH: '#divResultados_ table table',
    PLACE: 'tr:nth-child(2) td[colspan="9"] span span',
    getTeam: type => `.wid2_resultado_cerrada:nth-child(${type === 'local' ? 1 : 2})`
  }

  const removeNewLines = text => text
    .replace(/\r?\n|\r/, '')
    .trim();

  const onlyDigits = text => parseInt(text
    .match(/\d/g)
    .join());

  const getMatches = Array
    .from(document.querySelectorAll(SELECTORS.MATCH))
    .map(row => {
      const hasStyles = row => !!row.querySelector('style');
      const hasResults = row => !!row.querySelector('h4 strong').children.length;

      const getStyleContent = node => {

        const getPseudoelement = nodeStyle => nodeStyle.innerText.indexOf('before') > -1
          ? 'before'
          : 'after';

        const isHidden = nodeStyle => nodeStyle.innerText.indexOf('none') > -1;

        const childFiltered = Array
        .from(node.childNodes)
        .filter(res => res.nodeName === 'STYLE' || res.nodeName === 'SPAN');

        return !isHidden(childFiltered[0])
          ? getComputedStyle(childFiltered[1], `:${ getPseudoelement(childFiltered[0]) }`).content
          : childFiltered[1].innerText
      }

      const getText = container => hasStyles(container)
        ? getStyleContent(container)
        : container.innerText;

      const getDateTime = ([date, time]) => {
        const _date = date.split('-');
        const _time = time.split(':');
        return new Date(_date[2], _date[1] - 1, _date[0], _time[0], _time[1]);
      }

      const getTeamName = type => removeNewLines(
        row.querySelector(`td[align="${ 'local' === type ? 'left' : 'right' }"]`).innerText);

      const getTeamResult = type => hasResults(row)
        ? onlyDigits(getText(row.querySelector(SELECTORS.getTeam(type))))
        : null;

      const getPlace = type => {
        let _selector = row.querySelector(SELECTORS.PLACE).childNodes[ 'name' === type ? 1 : 2].textContent;
        _selector = removeNewLines(_selector);
        return 'name' === type ? _selector : _selector.split('- ')[1];
      };

      const getPlaceTime = () => hasResults(row)
        ? getDateTime(Array
          .from(row.querySelectorAll('.horario'))
          .map(dateTime => dateTime.textContent.trim()))
        : null

      const jsonObj = {
        local: {
          name: getTeamName('local'),
          result: getTeamResult('local')
        },
        visitor: {
          name: getTeamName('visitor'),
          result: getTeamResult('visitor')
        },
        place: {
          name: getPlace('name'),
          type: getPlace('type'),
          time: getPlaceTime(),
        }
      };

      jsonObj.result = hasResults(row) ? `${jsonObj.local.result} - ${jsonObj.visitor.result}` : null;
      return jsonObj;
    });

  window.rffm = Object.assign({},
  window.rffm,
  {
      getMatches: () => getMatches
  });

})(document);