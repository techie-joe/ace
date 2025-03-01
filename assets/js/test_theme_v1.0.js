/*! For license information please see theme_v1.0.js.LICENSE.txt */
/* ===============================================================
// TESTING ThemeJs
// ============================================================ */
(() => {
  const
    now = () => new Date().getMilliseconds(),
    RED = 'color:#e22200;',
    GREEN = 'color:#008800;',
    ORANGE = 'color:#916900;',
    PURPLE = 'color:#9f40a9;',
    BROWN = 'color:#a52a2a;',
    W = window,
    D = document,
    A = a => typeof a,
    TYPE = e => Object.prototype.toString.call(e),
    VOID = void 0,
    FUN = A(() => { }),
    OBJ = A({}),
    STR = A(''),
    ARR = TYPE([]),
    isARR = Array.isArray || (e => TYPE(e) === ARR),
    isFUN = v => A(v) === FUN,
    isOBJ = v => A(v) === OBJ,
    nodeId = e => D.getElementById(e),
    out = (v, style) => {
      var e = D.createElement('span');
      e.append(v);
      style && e.setAttribute('style', style);
      jsout.append(e, `\n`);
    },
    note = (v, style) => {
      out(v, style);
      style ? log('%c' + v, style) : log(v);
    },
    TEST = (what, label) => {
      what ? note(label + ' ☑', GREEN) : note(label + ' ☒', RED);
      return what;
    },
    { log, error } = console;

  // ============================================= initializations
  const
    jsout = nodeId('jsout'),
    jstest = nodeId('jstest'),
    element = nodeId('element'),
    hr = () => { jsout.append(D.createElement('hr')); },
    roll = () => { jso.scrollTo(0, jso.scrollHeight); },
    DOC = D.documentElement || D.body; // html or body

  // ================================================ add listener
  W.onerror = (event) => {
    jstest && (jstest.setAttribute('style', RED), jstest.innerHTML = '[JS:ER]');
    out(event.toString(), RED); roll();
  };

  note('Open developer console for detailed info. (Ctrl+Shift+J).', ORANGE);
  note('Initiate test.run() to begin.', ORANGE);

  const
    KEY = 'cuba',
    TC = 'theme',
    TL = 'themes';

  // ========================================================= run
  const run = () => {
    const THEN = now();
    hr();

    log('Testing AceJs Theme');

    // h = W.location.hostname;
    // log(h);
    // 'localhost'.replace(/\w/g,v=>v.charCodeAt(0))
    // ((h)=>(h.split('').forEach((c)=>{c}),h))()

    const { theme } = W;

    // ===================================================== theme
    if (!TEST(theme, 'window.theme')) { return }
    log(theme)

    // =================================================== storage
    if (!TEST(theme.fn.storage, 'window.theme.fn.storage')) { return }
    const { storage:store } = theme.fn;
    log(theme.fn.storage);
    W.storage = {
      set: () => {
        var value = 'T' + now();
        hr(); note('set ' + KEY + ' = ' + value, PURPLE); roll();
        store.set(KEY, value);
      },
      get: () => { hr(); note('get ' + KEY + ' = ' + store.get(KEY)); roll(); },
      remove: () => { hr(); note('remove ' + KEY + ' = ' + store.remove(KEY), BROWN); roll(); },
    };
    note('get ' + KEY + '   = ' + store.get(KEY));
    note('get ' + TC + '  = ' + store.get(TC));
    note('get ' + TL + ' = ' + store.get(TL));

    // ===================================================== theme

    note(`theme.list    = [${theme.list()}]`);
    note(`theme.current = ${theme.current()}`);
    note(`DOC.className = ${DOC.className}`);

    note(`Finished in ${now() - THEN}ms`, ORANGE);
    roll();
  }; // run

  // =================================================== run_check
  const run_check = () => {
    hr();

    if (!TEST(isFUN(theme.list), 'window.theme.list')) { return }
    if (!TEST(isFUN(theme.current), 'window.theme.current')) { return }

    note(`theme.list    = [${theme.list()}]`);
    note(`theme.current = ${theme.current()}`);

    roll();
  }; // run_check

  // =================================================== run_reset
  const run_reset = () => {
    hr();

    if (!TEST(isFUN(theme.reset), 'window.theme.reset')) { return }
    
    const { storage:store } = theme.fn;

    theme.reset();
    note('remove ' + TC + ' = ' + store.remove(TC), BROWN);
    note('remove ' + TL + ' = ' + store.remove(TL), BROWN);
    note(`theme.list    = [${theme.list()}]`);
    note(`theme.current = ${theme.current()}`);

    roll();
  }; // run_check

  // ============================================= run_updateClass
  const run_updateClass = () => {
    const THEN = now();
    hr();

    // =============================================== updateClass
    if (!TEST(isFUN(theme.fn.updateClass), 'window.theme.fn.updateClass')) { return }

    const { updateClass } = theme.fn;

    note(`DOC.className = ${DOC.className}`);
    updateClass(DOC, null, 'TEST');
    note(`DOC.className = ${DOC.className}`);
    updateClass(DOC, 'TEST');
    note(`DOC.className = ${DOC.className}`);

    note('testing logic for dev_updateClass', ORANGE);
    const dev_updateClass = (element, del, add) => {

      note([
        `now =.${element.className}.`,
        `del =.${del}.`,
        `add =.${add}.`,
      ].join("\n"));

      try {
        const
          newRegex = (pattern, flags) => new RegExp(pattern, flags),
          P = ' ',
          I = '|',
          X = 'g',
          SEP = newRegex('[\\.\\|\\s]+', X),
          TRIM = (s, sep = I) => s.trim().replace(SEP, sep).trim(),
          NEW = add ? TRIM(add, P) : _,
          DEL = del ? TRIM([del, NEW].join(P)).trim() : _,
          SEL = newRegex('(^|\\s+)(' + DEL + ')(\\s*(' + DEL + '))*(\\s+|$)', X),
          RES = element.className.replace(SEL, P).trim() + (NEW.length ? P + NEW : _);

        // (^|\s+)(DEL)(\s*(DEL))*(\s+|$)
        log([
          `TRY =.${element.className.replace(SEL, P)}.`,
          `NEW =.${NEW}.`,
          `DEL =.${DEL}.`,
          `SEL =.${SEL}.`,
          `RES =.${RES}.`,
        ].join("\n"));

        element.className = RES;
        return element;
      } catch (e) { error('Error while executing dev_updateClass : ' + e); }

      hr();

    };

    element.className = '  a  _ox_  b  c  _oo_  d  ';
    dev_updateClass(
      element,
      '  a  b  c  d  ',
      '  e  f  '
    );

    element.className = 'A _ox_ B C _oo D';
    dev_updateClass(
      element,
      'A B C D',
      'E F'
    );

    note(`Finished in ${now() - THEN}ms`, ORANGE);
    roll();
  }; // run

  // ===================================================== run_set
  const run_set = (n) => {
    hr();

    if (!TEST(isFUN(theme.set), 'window.theme.set')) { return }

    var before = theme.current() || 'none';

    if (n == 1) {
      note(`theme.set = []`);
      theme.set([]);
      var after = theme.current() || 'none';
    }

    else if (n == 2) {
      note(`theme.set = ['_dark']`);
      theme.set(['_dark']);
      var after = theme.current() || 'none';
    }

    else if (n == 3) {
      note(`theme.set = ['pink','light','_dark'], begin with = light`);
      theme.set(['pink', 'light', '_dark'], 'light');
      var after = theme.current() || 'none';
    }

    else {
      var new_theme = 'T' + now();
      note(`theme.set = ${new_theme}`);
      theme.set(new_theme);
      var after = theme.current() || 'none';
    }

    note(`theme changed from ${before} to ${after}`);

    roll();
  }; // run_set

  // ================================================== run_change
  const run_change = () => {
    hr();

    if (!TEST(isFUN(theme.change), 'window.theme.change')) { return }

    var before = theme.current() || 'none';
    theme.change();
    var after = theme.current() || 'none';
    note(`theme changed from ${before} to ${after}`);

    roll();
  }; // run_change

  // ==================================================== finished

  const clear = () => {
    console.clear();
    jsout.innerHTML = '';
    jstest && (jstest.setAttribute('style', GREEN), jstest.innerHTML = '[JS:OK]');
    note('Cleared', ORANGE);
  }; // clear

  W.test = {
    clear,
    run,
    run_check,
    run_reset,
    run_set,
    run_change,
    run_updateClass,
  };

  W.onload = run;

})();