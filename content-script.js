const appendStyleToPage = (rule, id, isDifficultyStyle) => {
  const styleNode = document.createElement('style');
  styleNode.setAttribute('id', id);
  styleNode.classList.add('hide-lc-difficulty-style-node');
  if (isDifficultyStyle)
    styleNode.classList.add('hide-lc-difficulty-style-node-difficulty');
  styleNode.type = 'text/css';
  if (styleNode.styleSheet) {
    css.styleSheet.cssText = rule;
  } else {
    styleNode.appendChild(document.createTextNode(rule));
  }
  document.head.appendChild(styleNode);
};

const easyMedRule = `
  td > span.round.label.label-success,
  td > span.round.label.label-warning {
    background-color: #bdc44f;
  }
  .css-10o4wqw > div.css-14oi08n,
  .css-10o4wqw > div.css-dcmtd5 {
    color: #bdc44f;
  }
  .next-challenge__A4ZV > .M__1OuS,
  .next-challenge__A4ZV > .E__2cGj {
    color: #608000;
    border-color: #608000;
    background-color: #f2ffe6;
  }
  .next-challenge__A4ZV > .H__3Dxi:hover,
  .next-challenge__A4ZV > .M__1OuS:hover,
  .next-challenge__A4ZV > .E__2cGj:hover {
    color: #b3b300;
    border-color: #b3b300;
  }
`;

const medHardRule = `
  td > span.round.label.label-warning,
  td > span.round.label.label-danger {
    background-color: orangered;
  }
  .css-10o4wqw > div.css-dcmtd5,
  .css-10o4wqw > div.css-t42afm {
    color: orangered;
  }
  .next-challenge__A4ZV > .H__3Dxi,
  .next-challenge__A4ZV > .M__1OuS {
    color: #ff8d63;
    border-color: #ff8d63;
    background-color: #fff0e6;
  }
  .next-challenge__A4ZV > .H__3Dxi:hover,
  .next-challenge__A4ZV > .M__1OuS:hover {
    color: orangered;
    border-color: orangered;
  }
`;

const hideAllRule = `
  td > span.round.label {
    background-color: purple;
  }
  /* on problem page */
  .css-10o4wqw > div.css-14oi08n,
  .css-10o4wqw > div.css-dcmtd5,
  .css-10o4wqw > div.css-t42afm {
    color: purple;
  }
  /* once solved */
  .next-challenge__A4ZV > .H__3Dxi,
  .next-challenge__A4ZV > .M__1OuS,
  .next-challenge__A4ZV > .E__2cGj {
    color: #916c91;
    border-color: #916c91;
    background-color: lavender;
  }
  .next-challenge__A4ZV > .H__3Dxi:hover,
  .next-challenge__A4ZV > .M__1OuS:hover,
  .next-challenge__A4ZV > .E__2cGj:hover {
    color: purple;
    border-color: purple;
  }
`;

const hideAcceptanceRule = `
  td:nth-child(5) {
    color: transparent;
  }

  div.css-oqu510 {
    visibility: hidden;
  }
`;

const removeAllCSS = () => {
  const nodes = document.querySelectorAll(
    'style.hide-lc-difficulty-style-node-difficulty',
  );
  nodes.forEach(ele => document.head.removeChild(ele));
};

const removeAcceptanceCSS = id => {
  const node = document.getElementById(id);
  if (node) document.head.removeChild(node);
};

const resetProblemSetAll = () => {
  let spanList = document.querySelectorAll(
    'td > span.round.label.label-success',
  );
  spanList.forEach(span => (span.innerText = 'Easy'));
  spanList = document.querySelectorAll('td > span.round.label.label-warning');
  spanList.forEach(span => (span.innerText = 'Medium'));
  spanList = document.querySelectorAll('td > span.round.label.label-danger');
  spanList.forEach(span => (span.innerText = 'Hard'));
};

const resetProblemPageDifficulty = () => {
  removeAllCSS();
  const node = document.querySelector('.css-10o4wqw > div');
  if (!node) return;
  if (node.className === 'css-14oi08n') {
    node.innerText = 'Easy';
  } else if (node.className === 'css-dcmtd5') {
    node.innerText = 'Medium';
  } else {
    node.innerText = 'Hard';
  }
};

const addListeners = cb => {
  if (window.location.pathname !== '/problemset/all/') return;

  const header = document.querySelector('tr.reactable-column-header');
  const pagination = document.querySelector('tbody.reactable-pagination');
  const select = document.querySelector('select.form-control');

  if (header) header.addEventListener('click', cb);
  if (pagination) pagination.addEventListener('click', cb);
  if (select) select.addEventListener('change', cb);
};

const removeListeners = () => {
  const header = document.querySelector('tr.reactable-column-header');
  const pagination = document.querySelector('tbody.reactable-pagination');
  const select = document.querySelector('select.form-control');

  if (header) {
    header.removeEventListener('click', changeToEasyMed);
    header.removeEventListener('click', changeToMedHard);
    header.removeEventListener('click', changeToHideAll);
  }
  if (pagination) {
    pagination.removeEventListener('click', changeToEasyMed);
    pagination.removeEventListener('click', changeToMedHard);
    pagination.removeEventListener('click', changeToHideAll);
  }
  if (select) {
    select.removeEventListener('change', changeToEasyMed);
    select.removeEventListener('change', changeToMedHard);
    select.removeEventListener('change', changeToHideAll);
  }
};

const resetAllDifficulty = () => {
  if (window.location.pathname === '/problemset/all/') {
    removeListeners();
    removeAllCSS();
    resetProblemSetAll();
  }

  if (window.location.pathname.includes('/problems/')) {
    resetProblemPageDifficulty();
  }
};

const pageHasLoaded = callback => {
  let ele = null;
  let pollCount = 0;
  const pollMax = 50;
  let interval = null;

  if (window.location.pathname === '/problemset/all/') {
    interval = setInterval(() => {
      ele = document.querySelector('select.form-control');
      if (ele !== null) {
        callback();
        clearInterval(interval);
      } else if (pollCount >= pollMax) {
        clearInterval(interval);
        return;
      } else {
        pollCount++;
      }
    }, 200);
  } else if (window.location.pathname.includes('/problems/')) {
    interval = setInterval(() => {
      ele = document.querySelector('.css-10o4wqw > div');
      if (ele !== null) {
        callback();
        clearInterval(interval);
      } else if (pollCount >= pollMax) {
        clearInterval(interval);
        return;
      } else {
        pollCount++;
      }
    }, 200);
  } else {
    return;
  }
};

// these methods have slight delay to wait for React to change/render elements
const changeToEasyMed = () => {
  setTimeout(() => {
    resetProblemSetAll();
    if (!document.getElementById('hide-lc-difficulty-easy-med')) {
      appendStyleToPage(easyMedRule, 'hide-lc-difficulty-easy-med', true);
    }

    let spanList = document.querySelectorAll(
      'td > span.round.label.label-warning, td > span.round.label.label-success',
    );
    spanList.forEach(span => (span.innerText = 'Easy/Medium'));

    const node = document.querySelector('.css-10o4wqw > div');
    if (!node) return;
    if (node.className === 'css-14oi08n' || node.className === 'css-dcmtd5') {
      node.innerText = 'Easy/Medium';
    }
  }, 100);
};

const changeToMedHard = () => {
  setTimeout(() => {
    resetProblemSetAll();
    if (!document.getElementById('hide-lc-difficulty-med-hard')) {
      appendStyleToPage(medHardRule, 'hide-lc-difficulty-med-hard', true);
    }

    let spanList = document.querySelectorAll(
      'td > span.round.label.label-danger, td > span.round.label.label-warning',
    );
    spanList.forEach(span => (span.innerText = 'Medium/Hard'));

    const node = document.querySelector('.css-10o4wqw > div');
    if (!node) return;
    if (node.className === 'css-t42afm' || node.className === 'css-dcmtd5') {
      node.innerText = 'Medium/Hard';
    }
  }, 100);
};

const changeToHideAll = () => {
  setTimeout(() => {
    resetProblemSetAll();
    if (!document.getElementById('hide-lc-difficulty-hide-all')) {
      appendStyleToPage(hideAllRule, 'hide-lc-difficulty-hide-all', true);
    }

    let spanList = document.querySelectorAll('td > span.round.label');
    spanList.forEach(span => (span.innerText = 'Difficulty Hidden'));

    const node = document.querySelector('.css-10o4wqw > div');
    if (!node) return;
    node.innerText = 'Difficulty Hidden';
  }, 100);
};

const changePageContent = arg => {
  resetAllDifficulty();
  pageHasLoaded(() => {
    if (arg === 'easyMed') {
      changeToEasyMed();
      addListeners(changeToEasyMed);
    }
    if (arg === 'medHard') {
      changeToMedHard();
      addListeners(changeToMedHard);
    }
    if (arg === 'hideAll') {
      changeToHideAll();
      addListeners(changeToHideAll);
    }
  });
};

// when page loads, get the state and update the page accordingly
chrome.storage.local.get(
  ['hidelcActive', 'hidelcRule', 'hidelcAcceptance'],
  ({ hidelcActive, hidelcRule, hidelcAcceptance }) => {
    if (hidelcActive) changePageContent(hidelcRule);
    if (hidelcAcceptance)
      appendStyleToPage(
        hideAcceptanceRule,
        'hide-lc-difficulty-style-node-acceptance',
        false,
      );
  },
);

// accepting events
chrome.runtime.onMessage.addListener(
  ({ hidelcRule, hidelcActive, hidelcRevealEvent, hidelcAcceptance }) => {
    //handles difficulty
    if (hidelcActive === false) {
      resetAllDifficulty();
      removeAcceptanceCSS('hide-lc-difficulty-style-node-acceptance');
    } else if (hidelcActive === true) {
      chrome.storage.local.get(
        ['hidelcRule', 'hidelcRule', 'hidelcAcceptance'],
        ({ hidelcRule, hidelcAcceptance }) => {
          changePageContent(hidelcRule);
          if (hidelcAcceptance) {
            appendStyleToPage(
              hideAcceptanceRule,
              'hide-lc-difficulty-style-node-acceptance',
              false,
            );
          }
        },
      );
    } else if (hidelcActive === undefined && hidelcRule) {
      changePageContent(hidelcRule);
    }

    // hides acceptance rate
    if (hidelcAcceptance) {
      appendStyleToPage(
        hideAcceptanceRule,
        'hide-lc-difficulty-style-node-acceptance',
        false,
      );
    } else if (hidelcAcceptance === false) {
      removeAcceptanceCSS('hide-lc-difficulty-style-node-acceptance');
    }

    // handles reveal
    if (hidelcRevealEvent) {
      const ele =
        document.querySelector('.css-14oi08n') ||
        document.querySelector('.css-dcmtd5') ||
        document.querySelector('.css-t42afm');
      const difficulty = ele.getAttribute('diff');
      const spanText = document.createTextNode(
        `${difficulty[0].toUpperCase()}${difficulty.slice(1)}`,
      );
      const span = document.createElement('span');
      span.className = document.querySelector('.css-10o4wqw > div').className;
      span.style.margin = 0;
      span.style['font-size'] = '20px';
      span.appendChild(spanText);
      const div = document.createElement('div');
      div.appendChild(
        document.createTextNode(
          `You solved a${difficulty[0] === 'e' ? 'n' : ''} `,
        ),
      );
      div.appendChild(span);
      div.appendChild(document.createTextNode(' problem!'));

      const parent = document.querySelector(
        'div.submissions__1ROo > div.result-container__33Nb > div.container__nthg',
      );
      parent.insertBefore(div, parent.children[1]);
      chrome.storage.local.set({ hidelcSubmitted: false });
    }
  },
);
