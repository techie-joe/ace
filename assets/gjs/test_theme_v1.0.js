/*! For license information please see theme_v1.0.min.js.LICENSE.txt */
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
    out(event.toString(), RED);
    jstest && (jstest.setAttribute('style', RED), jstest.innerHTML = '[JS:ER]');
  };

  note('Open developer console (Ctrl+Shift+J) for detailed info.', ORANGE);
  note('Initiate test.run() to begin.', ORANGE);

  // ========================================================= run
  const run = () => {
    const THEN = now();
    hr();

    log('Testing AceJs Theme');

    // h = W.location.hostname;
    // log(h);
    // 'localhost'.replace(/\w/g,v=>v.charCodeAt(0))
    // ((h)=>(h.split('').forEach((c)=>{c}),h))()

    const { ace, theme } = W;

    // ===================================================== theme
    if (!TEST(theme, 'window.theme')) { return }
    log(theme)
    note(`theme.current = ${theme.current()}`);
    note(`theme.list    = [${theme.list()}]`);
    note(`DOC.className = ${DOC.className}`);

    hr();
    // ======================================================= ace
    if (!TEST(ace, 'window.ace')) { return }
    log(ace)

    // note(`Testing fail procedure. See console.`, ORANGE)
    // const { _try, invalid, failTo } = ace;
    // _try(invalid, 'err');
    // _try(invalid, 'aaa', 'fff');
    // _try(invalid, 'aaa', 'fff', 'ccc');
    // _try(failTo, 'www');

    // =================================================== storage
    if (!TEST(ace.storage, 'window.ace.storage')) { return }
    const { storage } = ace;
    log(storage);
    const
      KEY = 'cuba',
      TC = 'theme',
      TL = 'themes';
    W.storage = {
      set: () => {
        var value = 'T' + now();
        hr(); note('set ' + KEY + ' = ' + value, PURPLE); roll();
        storage.set(KEY, value);
      },
      get: () => { hr(); note('get ' + KEY + ' = ' + storage.get(KEY)); roll(); },
      remove: () => { hr(); note('remove ' + KEY + ' = ' + storage.remove(KEY), BROWN); roll(); },
      resetTheme: () => {
        hr();
        note('remove ' + TC + ' = ' + storage.remove(TC));
        note('remove ' + TL + ' = ' + storage.remove(TL));
        roll();
      },
    };
    note('get ' + KEY + '   = ' + storage.get(KEY));
    note('get ' + TC + '  = ' + storage.get(TC));
    note('get ' + TL + ' = ' + storage.get(TL));

    // ===================================================== theme

    hr();
    note(`Finished in ${now() - THEN}ms`);
    roll();
  }; // run

  // =================================================== run_check
  const run_check = () => {
    hr();
    note(`theme.current = ${theme.current()}`);
    note(`theme.list    = [${theme.list()}]`);
    roll();
  }; // run_check

  // ============================================= run_updateClass
  const run_updateClass = () => {
    const THEN = now();
    hr();
    const { ace } = W;

    // =============================================== updateClass
    if (!TEST(isFUN(ace.updateClass), 'window.ace.updateClass')) { return }

    note(`DOC.className = ${DOC.className}`);
    ace.updateClass(DOC, null, 'TEST');
    note(`DOC.className = ${DOC.className}`);
    ace.updateClass(DOC, 'TEST');
    note(`DOC.className = ${DOC.className}`);

    note('testing logic for updateClass', ORANGE);
    const updateClass = (element, del, add) => {

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
      } catch (e) { error('Error while executing updateClass : ' + e); }

      hr();

    };

    element.className = '  a  _ox_  b  c  _oo_  d  ';
    updateClass(
      element,
      '  a  b  c  d  ',
      '  e  f  '
    );

    element.className = 'A _ox_ B C _oo D';
    updateClass(
      element,
      'A B C D',
      'E F'
    );

    hr();
    note(`Finished in ${now() - THEN}ms`);
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
    note('Cleared.', ORANGE);
  }; // clear

  W.test = {
    clear,
    run,
    run_check,
    run_set,
    run_change,
    run_updateClass,
  };

})();