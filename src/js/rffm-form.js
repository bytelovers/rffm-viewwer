(function(document) {

  const SELECTORS = {
      SEARCH_FORM: '#portlet_search',
      SEASON: 'temporada',
      CATEGORIES: 'competicion',
      GROUPS: 'grupo',
      PLAYER_TYPES: 'Sch_Tipo_Juego',
      getSelect(type) { return `${SELECTORS.SEARCH_FORM} select[name="${type}"]` }
  }

  const getList = (selector, node) => {
      const _node = node || document.body;
      return Array.from(_node.querySelectorAll(selector));
  }

  const getOptions = (selector, node) => getList(selector, node)
      .map(opt => { return { value: opt.value, label: opt.innerText.trim() }});

  const seasons = getOptions(`${ SELECTORS.getSelect(SELECTORS.SEASON) } option`);
  const playerTypes = getOptions(`${ SELECTORS.getSelect(SELECTORS.PLAYER_TYPES) } option`);
  const groups = getOptions(`${ SELECTORS.getSelect(SELECTORS.GROUPS) } option`)
     
  const categories = Array.from(
          document.querySelectorAll(`${ SELECTORS.getSelect(SELECTORS.CATEGORIES) } optgroup`))
      .map(grp => { return { label: grp.label, items: getOptions(`option`, grp) }});
  
  window.rffm = Object.assign({},
    window.rffm,  
    {
      getSeasons: () => seasons,
      getPlayerTypes: () => playerTypes,
      getGroups: () => groups,
      getCategories: () => categories
    });
})(document)