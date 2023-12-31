import {
  u as ve,
  r as z,
  e as Se,
  _ as _e,
  f as be,
  g as we,
  a as f,
  R as g,
  h as ke,
  c as Te,
  s as de,
  j as k,
  S as Ee,
  i as Q,
  T as M,
  t as xe,
  E as Ce,
  m as ye,
  k as ae,
  W as Me,
  M as Re,
  l as Be,
  b as Ne,
  d as De,
} from "./assets/wsPort-d13879e1.js";
class Fe {
  constructor(e, t, s, i) {
    (this._tests = new Map()),
      (this._listOnly = !1),
      (this._clearPreviousResultsWhenTestBegins = !1),
      (this._rootSuite = new O("", "root")),
      (this._pathSeparator = e),
      (this._reporter = t),
      (this._reuseTestCases = s),
      (this._reportConfig = i);
  }
  dispatch(e) {
    const { method: t, params: s } = e;
    if (t === "onConfigure") {
      this._onConfigure(s.config);
      return;
    }
    if (t === "onBegin") {
      this._onBegin(s.projects);
      return;
    }
    if (t === "onTestBegin") {
      this._onTestBegin(s.testId, s.result);
      return;
    }
    if (t === "onTestEnd") {
      this._onTestEnd(s.test, s.result);
      return;
    }
    if (t === "onStepBegin") {
      this._onStepBegin(s.testId, s.resultId, s.step);
      return;
    }
    if (t === "onStepEnd") {
      this._onStepEnd(s.testId, s.resultId, s.step);
      return;
    }
    if (t === "onError") {
      this._onError(s.error);
      return;
    }
    if (t === "onStdIO") {
      this._onStdIO(s.type, s.testId, s.resultId, s.data, s.isBase64);
      return;
    }
    if (t === "onEnd") return this._onEnd(s.result);
    if (t === "onExit") return this._onExit();
  }
  _setClearPreviousResultsWhenTestBegins() {
    this._clearPreviousResultsWhenTestBegins = !0;
  }
  _onConfigure(e) {
    var t;
    (this._rootDir = ((t = this._reportConfig) == null ? void 0 : t.rootDir) || e.rootDir),
      (this._listOnly = e.listOnly),
      (this._config = this._parseConfig(e)),
      this._reporter.onConfigure(this._config);
  }
  _onBegin(e) {
    var t, s;
    for (const i of e) {
      let r = this._rootSuite.suites.find(c => c.project().id === i.id);
      r || ((r = new O(i.name, "project")), this._rootSuite.suites.push(r), (r.parent = this._rootSuite));
      const o = this._parseProject(i);
      if (((r.project = () => o), this._mergeSuitesInto(i.suites, r), this._listOnly)) {
        const c = new Set(),
          u = l => {
            l.tests.map(m => m.testId).forEach(m => c.add(m)), l.suites.forEach(u);
          };
        i.suites.forEach(u);
        const h = l => {
          (l.tests = l.tests.filter(m => c.has(m.id))), l.suites.forEach(h);
        };
        h(r);
      }
    }
    (s = (t = this._reporter).onBegin) == null || s.call(t, this._rootSuite);
  }
  _onTestBegin(e, t) {
    var r, o;
    const s = this._tests.get(e);
    this._clearPreviousResultsWhenTestBegins && s._clearResults();
    const i = s._createTestResult(t.id);
    (i.retry = t.retry),
      (i.workerIndex = t.workerIndex),
      (i.parallelIndex = t.parallelIndex),
      (i.startTime = new Date(t.startTime)),
      (i.statusEx = "running"),
      (o = (r = this._reporter).onTestBegin) == null || o.call(r, s, i);
  }
  _onTestEnd(e, t) {
    var r, o, c;
    const s = this._tests.get(e.testId);
    (s.timeout = e.timeout), (s.expectedStatus = e.expectedStatus), (s.annotations = e.annotations);
    const i = s.resultsMap.get(t.id);
    (i.duration = t.duration),
      (i.status = t.status),
      (i.statusEx = t.status),
      (i.errors = t.errors),
      (i.error = (r = i.errors) == null ? void 0 : r[0]),
      (i.attachments = this._parseAttachments(t.attachments)),
      (c = (o = this._reporter).onTestEnd) == null || c.call(o, s, i);
  }
  _onStepBegin(e, t, s) {
    var u, h;
    const i = this._tests.get(e),
      r = i.resultsMap.get(t),
      o = s.parentStepId ? r.stepMap.get(s.parentStepId) : void 0,
      c = {
        titlePath: () => [...((o == null ? void 0 : o.titlePath()) || []), s.title],
        title: s.title,
        category: s.category,
        location: this._absoluteLocation(s.location),
        parent: o,
        startTime: new Date(s.startTime),
        duration: -1,
        steps: [],
      };
    o ? o.steps.push(c) : r.steps.push(c),
      r.stepMap.set(s.id, c),
      (h = (u = this._reporter).onStepBegin) == null || h.call(u, i, r, c);
  }
  _onStepEnd(e, t, s) {
    var c, u;
    const i = this._tests.get(e),
      r = i.resultsMap.get(t),
      o = r.stepMap.get(s.id);
    (o.duration = s.duration), (o.error = s.error), (u = (c = this._reporter).onStepEnd) == null || u.call(c, i, r, o);
  }
  _onError(e) {
    var t, s;
    (s = (t = this._reporter).onError) == null || s.call(t, e);
  }
  _onStdIO(e, t, s, i, r) {
    var h, l, m, p;
    const o = r ? (globalThis.Buffer ? Buffer.from(i, "base64") : atob(i)) : i,
      c = t ? this._tests.get(t) : void 0,
      u = c && s ? c.resultsMap.get(s) : void 0;
    e === "stdout"
      ? (u == null || u.stdout.push(o), (l = (h = this._reporter).onStdOut) == null || l.call(h, o, c, u))
      : (u == null || u.stderr.push(o), (p = (m = this._reporter).onStdErr) == null || p.call(m, o, c, u));
  }
  _onEnd(e) {
    var t, s;
    return (s = (t = this._reporter).onEnd) == null ? void 0 : s.call(t, e);
  }
  _onExit() {
    var e, t;
    return (t = (e = this._reporter).onExit) == null ? void 0 : t.call(e);
  }
  _parseConfig(e) {
    const t = { ...fe, ...e };
    return (
      this._reportConfig &&
        ((t.configFile = this._reportConfig.configFile),
        (t.rootDir = this._reportConfig.rootDir),
        (t.reportSlowTests = this._reportConfig.reportSlowTests),
        (t.quiet = this._reportConfig.quiet)),
      t
    );
  }
  _parseProject(e) {
    return {
      id: e.id,
      metadata: e.metadata,
      name: e.name,
      outputDir: this._absolutePath(e.outputDir),
      repeatEach: e.repeatEach,
      retries: e.retries,
      testDir: this._absolutePath(e.testDir),
      testIgnore: J(e.testIgnore),
      testMatch: J(e.testMatch),
      timeout: e.timeout,
      grep: J(e.grep),
      grepInvert: J(e.grepInvert),
      dependencies: e.dependencies,
      teardown: e.teardown,
      snapshotDir: this._absolutePath(e.snapshotDir),
      use: {},
    };
  }
  _parseAttachments(e) {
    return e.map(t => ({ ...t, body: t.base64 && globalThis.Buffer ? Buffer.from(t.base64, "base64") : void 0 }));
  }
  _mergeSuitesInto(e, t) {
    for (const s of e) {
      let i = t.suites.find(r => r.title === s.title);
      i || ((i = new O(s.title, s.type)), (i.parent = t), t.suites.push(i)),
        (i.location = this._absoluteLocation(s.location)),
        (i._fileId = s.fileId),
        (i._parallelMode = s.parallelMode),
        this._mergeSuitesInto(s.suites, i),
        this._mergeTestsInto(s.tests, i);
    }
  }
  _mergeTestsInto(e, t) {
    for (const s of e) {
      let i = this._reuseTestCases ? t.tests.find(r => r.title === s.title) : void 0;
      i ||
        ((i = new Le(s.testId, s.title, this._absoluteLocation(s.location))),
        (i.parent = t),
        t.tests.push(i),
        this._tests.set(i.id, i)),
        this._updateTest(s, i);
    }
  }
  _updateTest(e, t) {
    return (t.id = e.testId), (t.location = this._absoluteLocation(e.location)), (t.retries = e.retries), t;
  }
  _absoluteLocation(e) {
    return e && { ...e, file: this._absolutePath(e.file) };
  }
  _absolutePath(e) {
    return e && this._rootDir + this._pathSeparator + e;
  }
}
class O {
  constructor(e, t) {
    (this._requireFile = ""),
      (this.suites = []),
      (this.tests = []),
      (this._parallelMode = "none"),
      (this.title = e),
      (this._type = t);
  }
  allTests() {
    const e = [],
      t = s => {
        for (const i of [...s.suites, ...s.tests]) i instanceof O ? t(i) : e.push(i);
      };
    return t(this), e;
  }
  titlePath() {
    const e = this.parent ? this.parent.titlePath() : [];
    return (this.title || this._type !== "describe") && e.push(this.title), e;
  }
  project() {}
}
class Le {
  constructor(e, t, s) {
    (this.fn = () => {}),
      (this.results = []),
      (this.expectedStatus = "passed"),
      (this.timeout = 0),
      (this.annotations = []),
      (this.retries = 0),
      (this.repeatEachIndex = 0),
      (this.resultsMap = new Map()),
      (this.id = e),
      (this.title = t),
      (this.location = s);
  }
  titlePath() {
    const e = this.parent ? this.parent.titlePath() : [];
    return e.push(this.title), e;
  }
  outcome() {
    const e = this.results.filter(t => t.status !== "skipped" && t.status !== "interrupted");
    return e.length
      ? e.every(t => t.status === this.expectedStatus)
        ? "expected"
        : e.some(t => t.status === this.expectedStatus)
        ? "flaky"
        : "unexpected"
      : "skipped";
  }
  ok() {
    const e = this.outcome();
    return e === "expected" || e === "flaky" || e === "skipped";
  }
  _clearResults() {
    (this.results = []), this.resultsMap.clear();
  }
  _createTestResult(e) {
    const t = {
      retry: this.results.length,
      parallelIndex: -1,
      workerIndex: -1,
      duration: -1,
      startTime: new Date(),
      stdout: [],
      stderr: [],
      attachments: [],
      status: "skipped",
      statusEx: "scheduled",
      steps: [],
      errors: [],
      stepMap: new Map(),
    };
    return this.results.push(t), this.resultsMap.set(e, t), t;
  }
}
const fe = {
  forbidOnly: !1,
  fullyParallel: !1,
  globalSetup: null,
  globalTeardown: null,
  globalTimeout: 0,
  grep: /.*/,
  grepInvert: null,
  maxFailures: 0,
  metadata: {},
  preserveOutput: "always",
  projects: [],
  reporter: [[{}.CI ? "dot" : "list"]],
  reportSlowTests: { max: 5, threshold: 15e3 },
  configFile: "",
  rootDir: "",
  quiet: !1,
  shard: null,
  updateSnapshots: "missing",
  version: "",
  workers: 0,
  webServer: null,
};
function J(n) {
  return n.map(e => (e.s ? e.s : new RegExp(e.r.source, e.r.flags)));
}
const Pe = ({ source: n }) => {
    const [e, t] = ve(),
      [s, i] = z.useState(Se()),
      [r] = z.useState(
        _e(
          () => import("./assets/xtermModule-443332e6.js"),
          ["./assets/xtermModule-443332e6.js", "./xtermModule.6428296b.css"],
          import.meta.url,
        ).then(c => c.default),
      ),
      o = z.useRef(null);
    return (
      z.useEffect(() => (be(i), () => we(i)), []),
      z.useEffect(() => {
        const c = n.write,
          u = n.clear;
        return (
          (async () => {
            const { Terminal: h, FitAddon: l } = await r,
              m = t.current;
            if (!m) return;
            const p = s === "dark-mode" ? We : Oe;
            if (o.current && o.current.terminal.options.theme === p) return;
            o.current && (m.textContent = "");
            const d = new h({
                convertEol: !0,
                fontSize: 13,
                scrollback: 1e4,
                fontFamily: "var(--vscode-editor-font-family)",
                theme: p,
              }),
              v = new l();
            d.loadAddon(v);
            for (const _ of n.pending) d.write(_);
            (n.write = _ => {
              n.pending.push(_), d.write(_);
            }),
              (n.clear = () => {
                (n.pending = []), d.clear();
              }),
              d.open(m),
              v.fit(),
              (o.current = { terminal: d, fitAddon: v });
          })(),
          () => {
            (n.clear = u), (n.write = c);
          }
        );
      }, [r, o, t, n, s]),
      z.useEffect(() => {
        setTimeout(() => {
          o.current && (o.current.fitAddon.fit(), n.resize(o.current.terminal.cols, o.current.terminal.rows));
        }, 250);
      }, [e, n]),
      f("div", { "data-testid": "output", className: "xterm-wrapper", style: { flex: "auto" }, ref: t })
    );
  },
  Oe = {
    foreground: "#383a42",
    background: "#fafafa",
    cursor: "#383a42",
    black: "#000000",
    red: "#e45649",
    green: "#50a14f",
    yellow: "#c18401",
    blue: "#4078f2",
    magenta: "#a626a4",
    cyan: "#0184bc",
    white: "#a0a0a0",
    brightBlack: "#000000",
    brightRed: "#e06c75",
    brightGreen: "#98c379",
    brightYellow: "#d19a66",
    brightBlue: "#4078f2",
    brightMagenta: "#a626a4",
    brightCyan: "#0184bc",
    brightWhite: "#383a42",
    selectionBackground: "#d7d7d7",
    selectionForeground: "#383a42",
  },
  We = {
    foreground: "#f8f8f2",
    background: "#1e1e1e",
    cursor: "#f8f8f0",
    black: "#000000",
    red: "#ff5555",
    green: "#50fa7b",
    yellow: "#f1fa8c",
    blue: "#bd93f9",
    magenta: "#ff79c6",
    cyan: "#8be9fd",
    white: "#bfbfbf",
    brightBlack: "#4d4d4d",
    brightRed: "#ff6e6e",
    brightGreen: "#69ff94",
    brightYellow: "#ffffa5",
    brightBlue: "#d6acff",
    brightMagenta: "#ff92df",
    brightCyan: "#a4ffff",
    brightWhite: "#e6e6e6",
    selectionBackground: "#44475a",
    selectionForeground: "#f8f8f2",
  };
function je(n) {
  return `.playwright-artifacts-${n}`;
}
let oe = () => {},
  he = n => {},
  pe = { cols: 80, rows: 24 },
  H = async () => {};
const W = {
    pending: [],
    clear: () => {},
    write: n => W.pending.push(n),
    resize: (n, e) => {
      (pe = { cols: n, rows: e }), q("resizeTerminal", { cols: n, rows: e });
    },
  },
  Ae = ({}) => {
    var le;
    const [n, e] = g.useState(""),
      [t, s] = g.useState(!1),
      [i, r] = g.useState(
        new Map([
          ["passed", !1],
          ["failed", !1],
          ["skipped", !1],
        ]),
      ),
      [o, c] = g.useState(new Map()),
      [u, h] = g.useState({ config: void 0, rootSuite: void 0, loadErrors: [] }),
      [l, m] = g.useState(),
      [p, d] = g.useState({}),
      [v, _] = g.useState(new Set()),
      [T, C] = g.useState(!1),
      [y, B] = g.useState(),
      [R, Y] = ke("watch-all", !1),
      [ee, V] = g.useState({ value: new Set() }),
      a = g.useRef(Promise.resolve()),
      w = g.useRef(new Set()),
      [S, b] = g.useState(0),
      [E, x] = g.useState(!1),
      te = g.useRef(null),
      se = g.useCallback(() => {
        C(!0),
          V({ value: new Set() }),
          oe(fe, new O("", "root"), [], void 0),
          ge(!0).then(() => {
            C(!1);
          });
      }, []);
    g.useEffect(() => {
      var D;
      (D = te.current) == null || D.focus(),
        C(!0),
        Te({ onEvent: Ue, onClose: () => x(!0) }).then(F => {
          (H = F), se();
        });
    }, [se]),
      (oe = g.useCallback(
        (D, F, L, A) => {
          const P = D.configFile ? de.getObject(D.configFile + ":projects", void 0) : void 0;
          for (const N of o.keys()) F.suites.find(X => X.title === N) || o.delete(N);
          for (const N of F.suites) o.has(N.title) || o.set(N.title, !!(P != null && P.includes(N.title)));
          !P && o.size && ![...o.values()].includes(!0) && o.set(o.entries().next().value[0], !0),
            h({ config: D, rootSuite: F, loadErrors: L }),
            c(new Map(o)),
            y && A ? m({ ...A, total: y.testIds.size }) : A || m(void 0);
        },
        [o, y],
      ));
    const ie = g.useCallback(
        (D, F) => {
          (D === "bounce-if-busy" && y) ||
            ((w.current = new Set([...w.current, ...F])),
            (a.current = a.current.then(async () => {
              var P, N, X;
              const L = w.current;
              if (((w.current = new Set()), !L.size)) return;
              {
                for (const I of ((P = u.rootSuite) == null ? void 0 : P.allTests()) || [])
                  L.has(I.id) && (I._clearResults(), I._createTestResult("pending"));
                h({ ...u });
              }
              const A = "  [" + new Date().toLocaleTimeString() + "]";
              W.write("\x1B[2m—".repeat(Math.max(0, pe.cols - A.length)) + A + "\x1B[22m"),
                m({ total: L.size, passed: 0, failed: 0, skipped: 0 }),
                B({ testIds: L }),
                await H("run", { testIds: [...L] });
              for (const I of ((N = u.rootSuite) == null ? void 0 : N.allTests()) || [])
                ((X = I.results[0]) == null ? void 0 : X.duration) === -1 && I._clearResults();
              h({ ...u }), B(void 0);
            })));
        },
        [y, u],
      ),
      j = !!y;
    return k("div", {
      className: "vbox ui-mode",
      children: [
        E &&
          k("div", {
            className: "drop-target",
            children: [
              f("div", { className: "title", children: "UI Mode disconnected" }),
              k("div", {
                children: [
                  f("a", { href: "#", onClick: () => window.location.reload(), children: "Reload the page" }),
                  " to reconnect",
                ],
              }),
            ],
          }),
        k(Ee, {
          sidebarSize: 250,
          orientation: "horizontal",
          sidebarIsFirst: !0,
          children: [
            k("div", {
              className: "vbox",
              children: [
                k("div", {
                  className: "vbox" + (t ? "" : " hidden"),
                  children: [
                    k(Q, {
                      children: [
                        f("div", { className: "section-title", style: { flex: "none" }, children: "Output" }),
                        f(M, { icon: "circle-slash", title: "Clear output", onClick: () => W.clear() }),
                        f("div", { className: "spacer" }),
                        f(M, { icon: "close", title: "Close", onClick: () => s(!1) }),
                      ],
                    }),
                    f(Pe, { source: W }),
                  ],
                }),
                f("div", {
                  className: "vbox" + (t ? " hidden" : ""),
                  children: f(Ke, { item: p, rootDir: (le = u.config) == null ? void 0 : le.rootDir }),
                }),
              ],
            }),
            k("div", {
              className: "vbox ui-mode-sidebar",
              children: [
                k(Q, {
                  noShadow: !0,
                  noMinHeight: !0,
                  children: [
                    f("img", { src: "icon-32x32.png" }),
                    f("div", { className: "section-title", children: "Playwright" }),
                    f(M, { icon: "color-mode", title: "Toggle color mode", onClick: () => xe() }),
                    f(M, { icon: "refresh", title: "Reload", onClick: () => se(), disabled: j || T }),
                    f(M, {
                      icon: "terminal",
                      title: "Toggle output",
                      toggled: t,
                      onClick: () => {
                        s(!t);
                      },
                    }),
                  ],
                }),
                f(Ie, {
                  filterText: n,
                  setFilterText: e,
                  statusFilters: i,
                  setStatusFilters: r,
                  projectFilters: o,
                  setProjectFilters: c,
                  testModel: u,
                  runTests: () => ie("bounce-if-busy", v),
                }),
                k(Q, {
                  noMinHeight: !0,
                  children: [
                    !j && !l && f("div", { className: "section-title", children: "Tests" }),
                    !j &&
                      l &&
                      f("div", {
                        "data-testid": "status-line",
                        className: "status-line",
                        children: k("div", {
                          children: [l.passed, "/", l.total, " passed (", ((l.passed / l.total) * 100) | 0, "%)"],
                        }),
                      }),
                    j &&
                      l &&
                      f("div", {
                        "data-testid": "status-line",
                        className: "status-line",
                        children: k("div", {
                          children: [
                            "Running ",
                            l.passed,
                            "/",
                            y.testIds.size,
                            " passed (",
                            ((l.passed / y.testIds.size) * 100) | 0,
                            "%)",
                          ],
                        }),
                      }),
                    f(M, { icon: "play", title: "Run all", onClick: () => ie("bounce-if-busy", v), disabled: j || T }),
                    f(M, { icon: "debug-stop", title: "Stop", onClick: () => q("stop"), disabled: !j || T }),
                    f(M, { icon: "eye", title: "Watch all", toggled: R, onClick: () => Y(!R) }),
                    f(M, {
                      icon: "collapse-all",
                      title: "Collapse all",
                      onClick: () => {
                        b(S + 1);
                      },
                    }),
                  ],
                }),
                f(Ve, {
                  statusFilters: i,
                  projectFilters: o,
                  filterText: n,
                  testModel: u,
                  runningState: y,
                  runTests: ie,
                  onItemSelected: d,
                  setVisibleTestIds: _,
                  watchAll: R,
                  watchedTreeIds: ee,
                  setWatchedTreeIds: V,
                  isLoading: T,
                  requestedCollapseAllCount: S,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Ie = ({
    filterText: n,
    setFilterText: e,
    statusFilters: t,
    setStatusFilters: s,
    projectFilters: i,
    setProjectFilters: r,
    testModel: o,
    runTests: c,
  }) => {
    const [u, h] = g.useState(!1),
      l = g.useRef(null);
    g.useEffect(() => {
      var d;
      (d = l.current) == null || d.focus();
    }, []);
    const m =
        [...t.entries()]
          .filter(([d, v]) => v)
          .map(([d]) => d)
          .join(" ") || "all",
      p =
        [...i.entries()]
          .filter(([d, v]) => v)
          .map(([d]) => d)
          .join(" ") || "all";
    return k("div", {
      className: "filters",
      children: [
        f(Ce, {
          expanded: u,
          setExpanded: h,
          title: f("input", {
            ref: l,
            type: "search",
            placeholder: "Filter (e.g. text, @tag)",
            spellCheck: !1,
            value: n,
            onChange: d => {
              e(d.target.value);
            },
            onKeyDown: d => {
              d.key === "Enter" && c();
            },
          }),
        }),
        k("div", {
          className: "filter-summary",
          title:
            "Status: " +
            m +
            `
Projects: ` +
            p,
          onClick: () => h(!u),
          children: [
            f("span", { className: "filter-label", children: "Status:" }),
            " ",
            m,
            f("span", { className: "filter-label", children: "Projects:" }),
            " ",
            p,
          ],
        }),
        u &&
          k("div", {
            className: "hbox",
            style: { marginLeft: 14 },
            children: [
              f("div", {
                className: "filter-list",
                children: [...t.entries()].map(([d, v]) =>
                  f("div", {
                    className: "filter-entry",
                    children: k("label", {
                      children: [
                        f("input", {
                          type: "checkbox",
                          checked: v,
                          onClick: () => {
                            const _ = new Map(t);
                            _.set(d, !_.get(d)), s(_);
                          },
                        }),
                        f("div", { children: d }),
                      ],
                    }),
                  }),
                ),
              }),
              f("div", {
                className: "filter-list",
                children: [...i.entries()].map(([d, v]) =>
                  f("div", {
                    className: "filter-entry",
                    children: k("label", {
                      children: [
                        f("input", {
                          type: "checkbox",
                          checked: v,
                          onClick: () => {
                            var C;
                            const _ = new Map(i);
                            _.set(d, !_.get(d)), r(_);
                            const T = (C = o == null ? void 0 : o.config) == null ? void 0 : C.configFile;
                            T &&
                              de.setObject(
                                T + ":projects",
                                [..._.entries()].filter(([y, B]) => B).map(([y]) => y),
                              );
                          },
                        }),
                        f("div", { children: d }),
                      ],
                    }),
                  }),
                ),
              }),
            ],
          }),
      ],
    });
  },
  ze = Be,
  Ve = ({
    statusFilters: n,
    projectFilters: e,
    filterText: t,
    testModel: s,
    runTests: i,
    runningState: r,
    watchAll: o,
    watchedTreeIds: c,
    setWatchedTreeIds: u,
    isLoading: h,
    onItemSelected: l,
    setVisibleTestIds: m,
    requestedCollapseAllCount: p,
  }) => {
    const [d, v] = g.useState({ expandedItems: new Map() }),
      [_, T] = g.useState(),
      [C, y] = g.useState(p),
      {
        rootItem: B,
        treeItemMap: R,
        fileNames: Y,
      } = g.useMemo(() => {
        let a = He(s.rootSuite, s.loadErrors, e);
        Ye(a, t, n, r == null ? void 0 : r.testIds), me(a), (a = Xe(a)), Je(a);
        const w = new Map(),
          S = new Set(),
          b = new Set(),
          E = x => {
            x.kind === "group" && x.location.file && b.add(x.location.file),
              x.kind === "case" && x.tests.forEach(te => S.add(te.id)),
              x.children.forEach(E),
              w.set(x.id, x);
          };
        return E(a), m(S), { rootItem: a, treeItemMap: w, fileNames: b };
      }, [t, s, n, e, m, r]);
    g.useEffect(() => {
      if (C !== p) {
        d.expandedItems.clear();
        for (const S of R.keys()) d.expandedItems.set(S, !1);
        y(p), T(void 0), v({ ...d });
        return;
      }
      if (!r || r.itemSelectedByUser) return;
      let a;
      const w = S => {
        var b;
        S.children.forEach(w),
          !a &&
            S.status === "failed" &&
            ((S.kind === "test" && r.testIds.has(S.test.id)) ||
              (S.kind === "case" && r.testIds.has((b = S.tests[0]) == null ? void 0 : b.id))) &&
            (a = S);
      };
      w(B), a && T(a.id);
    }, [r, T, B, C, y, p, d, v, R]);
    const { selectedTreeItem: ee } = g.useMemo(() => {
      const a = _ ? R.get(_) : void 0;
      let w;
      a &&
        (w = {
          file: a.location.file,
          line: a.location.line,
          source: {
            errors: s.loadErrors
              .filter(b => {
                var E;
                return ((E = b.location) == null ? void 0 : E.file) === a.location.file;
              })
              .map(b => ({ line: b.location.line, message: b.message })),
            content: void 0,
          },
        });
      let S;
      return (
        (a == null ? void 0 : a.kind) === "test"
          ? (S = a.test)
          : (a == null ? void 0 : a.kind) === "case" && a.tests.length === 1 && (S = a.tests[0]),
        l({ testCase: S, testFile: w }),
        { selectedTreeItem: a }
      );
    }, [l, _, s, R]);
    g.useEffect(() => {
      if (!h)
        if (o) q("watch", { fileNames: [...Y] });
        else {
          const a = new Set();
          for (const w of c.value) {
            const S = R.get(w),
              b = S == null ? void 0 : S.location.file;
            b && a.add(b);
          }
          q("watch", { fileNames: [...a] });
        }
    }, [h, B, Y, o, c, R]);
    const V = a => {
      T(a.id), i("bounce-if-busy", ne(a));
    };
    return (
      (he = a => {
        const w = [],
          S = new Set(a);
        if (o) {
          const b = E => {
            const x = E.location.file;
            x && S.has(x) && w.push(...ne(E)), E.kind === "group" && E.subKind === "folder" && E.children.forEach(b);
          };
          b(B);
        } else
          for (const b of c.value) {
            const E = R.get(b),
              x = E == null ? void 0 : E.location.file;
            x && S.has(x) && w.push(...ne(E));
          }
        i("queue-if-busy", new Set(w));
      }),
      f(ze, {
        treeState: d,
        setTreeState: v,
        rootItem: B,
        dataTestId: "test-tree",
        render: a =>
          k("div", {
            className: "hbox ui-mode-list-item",
            children: [
              f("div", { className: "ui-mode-list-item-title", children: a.title }),
              !!a.duration &&
                a.status !== "skipped" &&
                f("div", { className: "ui-mode-list-item-time", children: ye(a.duration) }),
              k(Q, {
                noMinHeight: !0,
                noShadow: !0,
                children: [
                  f(M, { icon: "play", title: "Run", onClick: () => V(a), disabled: !!r }),
                  f(M, {
                    icon: "go-to-file",
                    title: "Open in VS Code",
                    onClick: () => q("open", { location: qe(a) }),
                    style: a.kind === "group" && a.subKind === "folder" ? { visibility: "hidden" } : {},
                  }),
                  !o &&
                    f(M, {
                      icon: "eye",
                      title: "Watch",
                      onClick: () => {
                        c.value.has(a.id) ? c.value.delete(a.id) : c.value.add(a.id), u({ ...c });
                      },
                      toggled: c.value.has(a.id),
                    }),
                ],
              }),
            ],
          }),
        icon: a =>
          a.status === "scheduled"
            ? "codicon-clock"
            : a.status === "running"
            ? "codicon-loading"
            : a.status === "failed"
            ? "codicon-error"
            : a.status === "passed"
            ? "codicon-check"
            : a.status === "skipped"
            ? "codicon-circle-slash"
            : "codicon-circle-outline",
        selectedItem: ee,
        onAccepted: V,
        onSelected: a => {
          r && (r.itemSelectedByUser = !0), T(a.id);
        },
        isError: a => (a.kind === "group" ? a.hasLoadErrors : !1),
        autoExpandDepth: t ? 5 : 1,
        noItemsMessage: h ? "Loading…" : "No tests",
      })
    );
  },
  Ke = ({ item: n, rootDir: e }) => {
    const [t, s] = g.useState(),
      [i, r] = g.useState(0),
      o = g.useRef(null),
      { outputDir: c } = g.useMemo(() => ({ outputDir: n.testCase ? $e(n.testCase) : void 0 }), [n]),
      [u, h] = g.useState(),
      l = g.useCallback(p => h(ae(p)), [h]),
      m = u ? (t == null ? void 0 : t.model.actions.find(p => ae(p) === u)) : void 0;
    return (
      g.useEffect(() => {
        var _, T;
        o.current && clearTimeout(o.current);
        const p = (_ = n.testCase) == null ? void 0 : _.results[0];
        if (!p) {
          s(void 0);
          return;
        }
        const d = p && p.duration >= 0 && p.attachments.find(C => C.name === "trace");
        if (d && d.path) {
          ue(d.path).then(C => s({ model: C, isLive: !1 }));
          return;
        }
        if (!c) {
          s(void 0);
          return;
        }
        const v = `${c}/${je(p.workerIndex)}/traces/${(T = n.testCase) == null ? void 0 : T.id}.json`;
        return (
          (o.current = setTimeout(async () => {
            try {
              const C = await ue(v);
              s({ model: C, isLive: !0 });
            } catch {
              s(void 0);
            } finally {
              r(i + 1);
            }
          }, 500)),
          () => {
            o.current && clearTimeout(o.current);
          }
        );
      }, [c, n, s, i, r]),
      f(
        Me,
        {
          model: t == null ? void 0 : t.model,
          hideTimelineBars: !0,
          hideStackFrames: !0,
          showSourcesFirst: !0,
          rootDir: e,
          initialSelection: m,
          onSelectionChanged: l,
          fallbackLocation: n.testFile,
          isLive: t == null ? void 0 : t.isLive,
          drawer: "bottom",
        },
        "workbench",
      )
    );
  };
let $, Z, U;
const ce = () => {
    clearTimeout(Z), (Z = void 0), oe(U.config, U.rootSuite, U.loadErrors, U.progress);
  },
  K = (n, e, t, s, i = !1) => {
    (U = { config: n, rootSuite: e, loadErrors: t, progress: s }), i ? ce() : Z || (Z = setTimeout(ce, 250));
  },
  ge = n => {
    if (!n) return H("list", {});
    let e;
    const t = [],
      s = { passed: 0, failed: 0, skipped: 0 };
    let i;
    return (
      ($ = new Fe(
        G,
        {
          version: () => "v2",
          onConfigure: r => {
            i = r;
          },
          onBegin: r => {
            e || (e = r), (s.passed = 0), (s.failed = 0), (s.skipped = 0), K(i, e, t, s, !0);
          },
          onEnd: () => {
            K(i, e, t, s, !0);
          },
          onTestBegin: () => {
            K(i, e, t, s);
          },
          onTestEnd: r => {
            r.outcome() === "skipped" ? ++s.skipped : r.outcome() === "unexpected" ? ++s.failed : ++s.passed,
              K(i, e, t, s);
          },
          onError: r => {
            W.write(
              (r.stack || r.value || "") +
                `
`,
            ),
              t.push(r),
              K(i, e ?? new O("", "root"), t, s);
          },
          printsToStdio: () => !1,
          onStdOut: () => {},
          onStdErr: () => {},
          onExit: () => {},
          onStepBegin: () => {},
          onStepEnd: () => {},
        },
        !0,
      )),
      $._setClearPreviousResultsWhenTestBegins(),
      H("list", {})
    );
  },
  q = (n, e) => {
    if (window._overrideProtocolForTest) {
      window._overrideProtocolForTest({ method: n, params: e }).catch(() => {});
      return;
    }
    H(n, e).catch(t => {
      console.error(t);
    });
  },
  Ue = (n, e) => {
    var t;
    if (n === "listChanged") {
      ge(!1).catch(() => {});
      return;
    }
    if (n === "testFilesChanged") {
      he(e.testFileNames);
      return;
    }
    if (n === "stdio") {
      if (e.buffer) {
        const s = atob(e.buffer);
        W.write(s);
      } else W.write(e.text);
      return;
    }
    (t = $ == null ? void 0 : $.dispatch({ method: n, params: e })) == null || t.catch(() => {});
  },
  $e = n => {
    var e;
    for (let t = n.parent; t; t = t.parent) if (t.project()) return (e = t.project()) == null ? void 0 : e.outputDir;
  },
  qe = n => {
    if (n) return n.location.file + ":" + n.location.line;
  },
  ne = n => {
    const e = new Set();
    if (!n) return e;
    const t = s => {
      var i;
      s.kind === "case"
        ? s.tests.map(r => r.id).forEach(r => e.add(r))
        : s.kind === "test"
        ? e.add(s.id)
        : (i = s.children) == null || i.forEach(t);
    };
    return t(n), e;
  };
function re(n, e, t, s) {
  if (e.length === 0) return n;
  const i = e.join(G),
    r = s.get(i);
  if (r) return r;
  const o = re(n, e.slice(0, e.length - 1), !1, s),
    c = {
      kind: "group",
      subKind: t ? "file" : "folder",
      id: i,
      title: e[e.length - 1],
      location: { file: i, line: 0, column: 0 },
      duration: 0,
      parent: o,
      children: [],
      status: "none",
      hasLoadErrors: !1,
    };
  return o.children.push(c), s.set(i, c), c;
}
function He(n, e, t) {
  const s = [...t.values()].some(Boolean),
    i = {
      kind: "group",
      subKind: "folder",
      id: "root",
      title: "",
      location: { file: "", line: 0, column: 0 },
      duration: 0,
      parent: void 0,
      children: [],
      status: "none",
      hasLoadErrors: !1,
    },
    r = (c, u, h) => {
      for (const l of u.suites) {
        const m = l.title || "<anonymous>";
        let p = h.children.find(d => d.title === m);
        p ||
          ((p = {
            kind: "group",
            subKind: "describe",
            id: h.id + "" + m,
            title: m,
            location: l.location,
            duration: 0,
            parent: h,
            children: [],
            status: "none",
            hasLoadErrors: !1,
          }),
          h.children.push(p)),
          r(c, l, p);
      }
      for (const l of u.tests) {
        const m = l.title;
        let p = h.children.find(_ => _.title === m);
        p ||
          ((p = {
            kind: "case",
            id: h.id + "" + m,
            title: m,
            parent: h,
            children: [],
            tests: [],
            location: l.location,
            duration: 0,
            status: "none",
          }),
          h.children.push(p));
        const d = l.results[0];
        let v = "none";
        (d == null ? void 0 : d.statusEx) === "scheduled"
          ? (v = "scheduled")
          : (d == null ? void 0 : d.statusEx) === "running"
          ? (v = "running")
          : (d == null ? void 0 : d.status) === "skipped"
          ? (v = "skipped")
          : (d == null ? void 0 : d.status) === "interrupted"
          ? (v = "none")
          : d && l.outcome() !== "expected"
          ? (v = "failed")
          : d && l.outcome() === "expected" && (v = "passed"),
          p.tests.push(l),
          p.children.push({
            kind: "test",
            id: l.id,
            title: c,
            location: l.location,
            test: l,
            parent: p,
            children: [],
            status: v,
            duration: l.results.length ? Math.max(0, l.results[0].duration) : 0,
            project: c,
          }),
          (p.duration = p.children.reduce((_, T) => _ + T.duration, 0));
      }
    },
    o = new Map();
  for (const c of (n == null ? void 0 : n.suites) || [])
    if (!(s && !t.get(c.title))) {
      for (const u of c.suites) {
        const h = re(i, u.location.file.split(G), !0, o);
        r(c.title, u, h);
      }
      for (const u of e) {
        if (!u.location) continue;
        const h = re(i, u.location.file.split(G), !0, o);
        h.hasLoadErrors = !0;
      }
    }
  return i;
}
function Ye(n, e, t, s) {
  const i = e.trim().toLowerCase().split(" "),
    r = [...t.values()].some(Boolean),
    o = u => {
      const h = u.tests[0].titlePath().join(" ").toLowerCase();
      return !i.every(l => h.includes(l)) && !u.tests.some(l => (s == null ? void 0 : s.has(l.id)))
        ? !1
        : ((u.children = u.children.filter(l => !r || (s == null ? void 0 : s.has(l.id)) || t.get(l.status))),
          (u.tests = u.children.map(l => l.test)),
          !!u.children.length);
    },
    c = u => {
      const h = [];
      for (const l of u.children)
        l.kind === "case" ? o(l) && h.push(l) : (c(l), (l.children.length || l.hasLoadErrors) && h.push(l));
      u.children = h;
    };
  c(n);
}
function me(n) {
  for (const o of n.children) me(o);
  n.kind === "group" &&
    n.children.sort((o, c) => o.location.file.localeCompare(c.location.file) || o.location.line - c.location.line);
  let e = n.children.length > 0,
    t = n.children.length > 0,
    s = !1,
    i = !1,
    r = !1;
  for (const o of n.children)
    (t = t && o.status === "skipped"),
      (e = e && (o.status === "passed" || o.status === "skipped")),
      (s = s || o.status === "failed"),
      (i = i || o.status === "running"),
      (r = r || o.status === "scheduled");
  i
    ? (n.status = "running")
    : r
    ? (n.status = "scheduled")
    : s
    ? (n.status = "failed")
    : t
    ? (n.status = "skipped")
    : e && (n.status = "passed");
}
function Xe(n) {
  let e = n;
  for (; e.children.length === 1 && e.children[0].kind === "group" && e.children[0].subKind === "folder"; )
    e = e.children[0];
  return (e.location = n.location), e;
}
function Je(n) {
  const e = t => {
    t.kind === "case" && t.children.length === 1 ? (t.children = []) : t.children.forEach(e);
  };
  e(n);
}
async function ue(n) {
  const e = new URLSearchParams();
  e.set("trace", n);
  const s = await (await fetch(`contexts?${e.toString()}`)).json();
  return new Re(s);
}
const G = navigator.userAgent.toLowerCase().includes("windows") ? "\\" : "/";
(async () => (
  Ne(),
  window.location.protocol !== "file:" &&
    (window.location.href.includes("isUnderTest=true") && (await new Promise(n => setTimeout(n, 1e3))),
    navigator.serviceWorker.register("sw.bundle.js"),
    navigator.serviceWorker.controller ||
      (await new Promise(n => {
        navigator.serviceWorker.oncontrollerchange = () => n();
      })),
    setInterval(function () {
      fetch("ping");
    }, 1e4)),
  De.render(f(Ae, {}), document.querySelector("#root"))
))();
