var _TD = {
    a: [], init: function (c, d) {
        delete this.init;
        var b, a = {
            version: "0.1.16",
            is_debug: !!d,
            is_paused: true,
            width: 16,
            height: 16,
            show_monster_life: true,
            fps: 0,
            exp_fps: 24,
            exp_fps_half: 12,
            exp_fps_quarter: 6,
            exp_fps_eighth: 4,
            stage_data: {},
            defaultSettings: function () {
                return {step_time: 36, grid_size: 32, padding: 10, global_speed: 0.1}
            },
            init: function (e) {
                this.obj_board = a.lang.$e(e);
                this.canvas = this.obj_board.getElementsByTagName("canvas")[0];
                if (!this.canvas.getContext) {
                    return
                }
                this.ctx = this.canvas.getContext("2d");
                this.monster_type_count = a.getDefaultMonsterAttributes();
                this.iframe = 0;
                this.last_iframe_time = (new Date()).getTime();
                this.fps = 0;
                this.start()
            },
            start: function () {
                clearTimeout(this._st);
                a.log("Start!");
                var e = this;
                this._exp_fps_0 = this.exp_fps - 0.4;
                this._exp_fps_1 = this.exp_fps + 0.4;
                this.mode = "normal";
                this.eventManager.clear();
                this.lang.mix(this, this.defaultSettings());
                this.stage = new a.Stage("stage-main", a.getDefaultStageData("stage_main"));
                this.canvas.setAttribute("width", this.stage.width);
                this.canvas.setAttribute("height", this.stage.height);
                this.canvas.onmousemove = function (g) {
                    var f = e.getEventXY.call(e, g);
                    e.hover(f[0], f[1])
                };
                this.canvas.onclick = function (g) {
                    var f = e.getEventXY.call(e, g);
                    e.click(f[0], f[1])
                };
                this.is_paused = false;
                this.stage.start();
                this.step();
                return this
            },
            checkCheat: function (e) {
                switch (e) {
                    case"money+":
                        this.money += 1000000;
                        this.log("cheat success!");
                        break;
                    case"life+":
                        this.life = 100;
                        this.log("cheat success!");
                        break;
                    case"life-":
                        this.life = 1;
                        this.log("cheat success!");
                        break;
                    case"difficulty+":
                        this.difficulty *= 2;
                        this.log("cheat success! difficulty = " + this.difficulty);
                        break;
                    case"difficulty-":
                        this.difficulty /= 2;
                        this.log("cheat success! difficulty = " + this.difficulty);
                        break
                }
            },
            step: function () {
                if (this.is_debug && _TD && _TD.cheat) {
                    this.checkCheat(_TD.cheat);
                    _TD.cheat = ""
                }
                if (this.is_paused) {
                    return
                }
                this.iframe++;
                if (this.iframe % 50 == 0) {
                    var f = (new Date()).getTime(), e = this.step_time;
                    this.fps = Math.round(500000 / (f - this.last_iframe_time)) / 10;
                    this.last_iframe_time = f;
                    if (this.fps < this._exp_fps_0 && e > 1) {
                        e--
                    } else {
                        if (this.fps > this._exp_fps_1) {
                            e++
                        }
                    }
                    this.step_time = e
                }
                if (this.iframe % 2400 == 0) {
                    a.gc()
                }
                this.stage.step();
                this.stage.render();
                var g = this;
                this._st = setTimeout(function () {
                    g.step()
                }, this.step_time)
            },
            getEventXY: function (h) {
                var g = a.lang.$e("wrapper"),
                    f = h.clientX - g.offsetLeft - this.canvas.offsetLeft + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
                    i = h.clientY - g.offsetTop - this.canvas.offsetTop + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                return [f, i]
            },
            hover: function (e, f) {
                this.eventManager.hover(e, f)
            },
            click: function (e, f) {
                this.eventManager.click(e, f)
            },
            mouseHand: function (e) {
                this.canvas.style.cursor = e ? "pointer" : "default"
            },
            log: function (e) {
                this.is_debug && window.console && console.log && console.log(e)
            },
            gc: function () {
                if (window.CollectGarbage) {
                    CollectGarbage();
                    setTimeout(CollectGarbage, 1)
                }
            }
        };
        for (b = 0; this.a[b]; b++) {
            this.a[b](a)
        }
        delete this.a;
        a.init(c)
    }
};
_TD.a.push(function (a) {
    a.lang = {
        $e: function (b) {
            return document.getElementById(b)
        }, $c: function (f, c, e) {
            var d = document.createElement(f);
            c = c || {};
            for (var b in c) {
                d.setAttribute(b, c[b])
            }
            if (e) {
                e.appendChild(d)
            }
            return d
        }, strLeft: function (g, h) {
            var e = g.slice(0, h), f = e.replace(/[^\x00-\xff]/g, "**").length;
            if (f <= h) {
                return e
            }
            f -= e.length;
            switch (f) {
                case 0:
                    return e;
                case h:
                    return g.slice(0, h >> 1);
                default:
                    var c = h - f, b = g.slice(c, h), d = b.replace(/[\x00-\xff]/g, "").length;
                    return d ? g.slice(0, c) + this.arguments.callee(b, d) : g.slice(0, c)
            }
        }, strLen2: function (b) {
            return b.replace(/[^\x00-\xff]/g, "**").length
        }, each: function (e, d) {
            if (Array.prototype.forEach) {
                e.forEach(d)
            } else {
                for (var c = 0, b = e.length; c < b; c++) {
                    d(e[c])
                }
            }
        }, any: function (e, d) {
            for (var c = 0, b = e.length; c < b; c++) {
                if (d(e[c])) {
                    return e[c]
                }
            }
            return null
        }, shift: function (c, b) {
            while (c[0]) {
                b(c.shift())
            }
        }, rndSort: function (c) {
            var b = c.concat();
            return b.sort(function () {
                return Math.random() - 0.5
            })
        }, _rndRGB2: function (b) {
            var c = b.toString(16);
            return c.length == 2 ? c : ("0" + c)
        }, rndRGB: function () {
            var e = Math.floor(Math.random() * 256), d = Math.floor(Math.random() * 256),
                c = Math.floor(Math.random() * 256);
            return "#" + this._rndRGB2(e) + this._rndRGB2(d) + this._rndRGB2(c)
        }, rgb2Arr: function (d) {
            if (d.length != 7) {
                return [0, 0, 0]
            }
            var f = d.substr(1, 2), e = d.substr(3, 2), c = d.substr(3, 2);
            return [parseInt(f, 16), parseInt(e, 16), parseInt(c, 16)]
        }, rndStr: function (g) {
            g = g || 16;
            var e = "1234567890abcdefghijklmnopqrstuvwxyz", b = [], c, f = e.length, d;
            for (c = 0; c < g; c++) {
                d = Math.floor(Math.random() * f);
                b.push(e.substr(d, 1))
            }
            return b.join("")
        }, nullFunc: function () {
        }, arrayEqual: function (d, c) {
            var e, b = d.length;
            if (b != c.length) {
                return false
            }
            for (e = 0; e < b; e++) {
                if (d[e] != c[e]) {
                    return false
                }
            }
            return true
        }, mix: function (d, b, c) {
            if (!b || !d) {
                return d
            }
            for (var e in b) {
                if (c !== false || !(e in d)) {
                    d[e] = b[e]
                }
            }
            return d
        }
    }
});
_TD.a.push(function (a) {
    a.eventManager = {
        ex: -1,
        ey: -1,
        _registers: {},
        ontypes: ["enter", "hover", "out", "click"],
        current_type: "hover",
        isOn: function (b) {
            return (this.ex != -1 && this.ey != -1 && this.ex > b.x && this.ex < b.x2 && this.ey > b.y && this.ey < b.y2)
        },
        _mkElEvtName: function (b, c) {
            return b.id + "::_evt_::" + c
        },
        on: function (b, d, c) {
            this._registers[this._mkElEvtName(b, d)] = [b, d, c]
        },
        removeEventListener: function (c, d) {
            var b = this._mkElEvtName(c, d);
            delete this._registers[b]
        },
        clear: function () {
            delete this._registers;
            this._registers = {}
        },
        step: function () {
            if (!this.current_type) {
                return
            }
            var e, m, d, n, l, b, g, i = this, c = this.ontypes.length, o, h = [];
            for (e in this._registers) {
                m = this._registers[e];
                d = m[0];
                n = m[1];
                l = m[2];
                if (!d.is_valid) {
                    h.push(d);
                    continue
                }
                if (!d.is_visiable) {
                    continue
                }
                o = this.isOn(d);
                if (this.current_type != "click") {
                    if (n == "hover" && d.is_hover && o) {
                        l();
                        this.current_type = "hover"
                    } else {
                        if (n == "enter" && !d.is_hover && o) {
                            d.is_hover = true;
                            l();
                            this.current_type = "enter"
                        } else {
                            if (n == "out" && d.is_hover && !o) {
                                d.is_hover = false;
                                l();
                                this.current_type = "out"
                            }
                        }
                    }
                } else {
                    if (o && n == "click") {
                        l()
                    }
                }
            }
            a.lang.each(h, function (f) {
                for (g = 0; g < c; g++) {
                    i.removeEventListener(f, i.ontypes[g])
                }
            });
            this.current_type = ""
        },
        hover: function (c, b) {
            if (this.current_type == "click") {
                return
            }
            this.current_type = "hover";
            this.ex = c;
            this.ey = b
        },
        click: function (c, b) {
            this.current_type = "click";
            this.ex = c;
            this.ey = b
        }
    }
});
_TD.a.push(function (a) {
    a.Stage = function (c, b) {
        this.id = c || ("stage-" + a.lang.rndStr());
        this.cfg = b || {};
        this.width = this.cfg.width || 600;
        this.height = this.cfg.height || 540;
        this.mode = "normal";
        this.state = 0;
        this.acts = [];
        this.current_act = null;
        this._step2 = a.lang.nullFunc;
        this._init()
    };
    a.Stage.prototype = {
        _init: function () {
            if (typeof this.cfg.init == "function") {
                this.cfg.init.call(this)
            }
            if (typeof this.cfg.step2 == "function") {
                this._step2 = this.cfg.step2
            }
        }, start: function () {
            this.state = 1;
            a.lang.each(this.acts, function (b) {
                b.start()
            })
        }, pause: function () {
            this.state = 2
        }, gameover: function () {
            this.current_act.gameover()
        }, clear: function () {
            this.state = 3;
            a.lang.each(this.acts, function (b) {
                b.clear()
            })
        }, step: function () {
            if (this.state != 1 || !this.current_act) {
                return
            }
            a.eventManager.step();
            this.current_act.step();
            this._step2()
        }, render: function () {
            if (this.state == 0 || this.state == 3 || !this.current_act) {
                return
            }
            this.current_act.render()
        }, addAct: function (b) {
            this.acts.push(b)
        }, addElement: function (d, b, c) {
            if (this.current_act) {
                this.current_act.addElement(d, b, c)
            }
        }
    }
});
_TD.a.push(function (a) {
    a.Act = function (b, c) {
        this.stage = b;
        this.id = c || ("act-" + a.lang.rndStr());
        this.state = 0;
        this.scenes = [];
        this.end_queue = [];
        this.current_scene = null;
        this._init()
    };
    a.Act.prototype = {
        _init: function () {
            this.stage.addAct(this)
        }, start: function () {
            if (this.stage.current_act && this.stage.current_act.state != 3) {
                this.state = 0;
                this.stage.current_act.queue(this.start);
                return
            }
            this.state = 1;
            this.stage.current_act = this;
            a.lang.each(this.scenes, function (b) {
                b.start()
            })
        }, pause: function () {
            this.state = 2
        }, end: function () {
            this.state = 3;
            var b;
            while (b = this.end_queue.shift()) {
                b()
            }
            this.stage.current_act = null
        }, queue: function (b) {
            this.end_queue.push(b)
        }, clear: function () {
            this.state = 3;
            a.lang.each(this.scenes, function (b) {
                b.clear()
            })
        }, step: function () {
            if (this.state != 1 || !this.current_scene) {
                return
            }
            this.current_scene.step()
        }, render: function () {
            if (this.state == 0 || this.state == 3 || !this.current_scene) {
                return
            }
            this.current_scene.render()
        }, addScene: function (b) {
            this.scenes.push(b)
        }, addElement: function (d, b, c) {
            if (this.current_scene) {
                this.current_scene.addElement(d, b, c)
            }
        }, gameover: function () {
            this.current_scene.gameover()
        }
    }
});
_TD.a.push(function (a) {
    a.Scene = function (b, c) {
        this.act = b;
        this.stage = b.stage;
        this.is_gameover = false;
        this.id = c || ("scene-" + a.lang.rndStr());
        this.state = 0;
        this.end_queue = [];
        this._step_elements = [[], [], []];
        this._render_elements = [[], [], [], [], [], [], [], [], [], []];
        this._init()
    };
    a.Scene.prototype = {
        _init: function () {
            this.act.addScene(this);
            this.wave = 0
        }, start: function () {
            if (this.act.current_scene && this.act.current_scene != this && this.act.current_scene.state != 3) {
                this.state = 0;
                this.act.current_scene.queue(this.start);
                return
            }
            this.state = 1;
            this.act.current_scene = this
        }, pause: function () {
            this.state = 2
        }, end: function () {
            this.state = 3;
            var b;
            while (b = this.end_queue.shift()) {
                b()
            }
            this.clear();
            this.act.current_scene = null
        }, clear: function () {
            a.lang.shift(this._step_elements, function (b) {
                a.lang.shift(b, function (c) {
                    c.del()
                })
            });
            a.lang.shift(this._render_elements, function (b) {
                a.lang.shift(b, function (c) {
                    c.del()
                })
            })
        }, queue: function (b) {
            this.end_queue.push(b)
        }, gameover: function () {
            if (this.is_gameover) {
                return
            }
            this.pause();
            this.is_gameover = true
        }, step: function () {
            if (this.state != 1) {
                return
            }
            if (a.life <= 0) {
                a.life = 0;
                this.gameover()
            }
            var c, b;
            for (c = 0; c < 3; c++) {
                b = [];
                var d = this._step_elements[c];
                a.lang.shift(d, function (e) {
                    if (e.is_valid) {
                        if (!e.is_paused) {
                            e.step()
                        }
                        b.push(e)
                    } else {
                        setTimeout(function () {
                            e = null
                        }, 500)
                    }
                });
                this._step_elements[c] = b
            }
        }, render: function () {
            if (this.state == 0 || this.state == 3) {
                return
            }
            var d, c, b = a.ctx;
            b.clearRect(0, 0, this.stage.width, this.stage.height);
            for (d = 0; d < 10; d++) {
                c = [];
                var e = this._render_elements[d];
                a.lang.shift(e, function (f) {
                    if (f.is_valid) {
                        if (f.is_visiable) {
                            f.render()
                        }
                        c.push(f)
                    }
                });
                this._render_elements[d] = c
            }
            if (this.is_gameover) {
                this.panel.gameover_obj.show()
            }
        }, addElement: function (d, b, c) {
            b = b || d.step_level || 1;
            c = c || d.render_level;
            this._step_elements[b].push(d);
            this._render_elements[c].push(d);
            d.scene = this;
            d.step_level = b;
            d.render_level = c
        }
    }
});
_TD.a.push(function (a) {
    a.Element = function (c, b) {
        this.id = c || ("el-" + a.lang.rndStr());
        this.cfg = b || {};
        this.is_valid = true;
        this.is_visiable = typeof b.is_visiable != "undefined" ? b.is_visiable : true;
        this.is_paused = false;
        this.is_hover = false;
        this.x = this.cfg.x || -1;
        this.y = this.cfg.y || -1;
        this.width = this.cfg.width || 0;
        this.height = this.cfg.height || 0;
        this.step_level = b.step_level || 1;
        this.render_level = b.render_level;
        this.on_events = b.on_events || [];
        this._init()
    };
    a.Element.prototype = {
        _init: function () {
            var e = this, d, c, b;
            for (d = 0, b = this.on_events.length; d < b; d++) {
                c = this.on_events[d];
                switch (c) {
                    case"enter":
                        this.on("enter", function () {
                            e.onEnter()
                        });
                        break;
                    case"out":
                        this.on("out", function () {
                            e.onOut()
                        });
                        break;
                    case"hover":
                        this.on("hover", function () {
                            e.onHover()
                        });
                        break;
                    case"click":
                        this.on("click", function () {
                            e.onClick()
                        });
                        break
                }
            }
            this.caculatePos()
        },
        caculatePos: function () {
            this.cx = this.x + this.width / 2;
            this.cy = this.y + this.height / 2;
            this.x2 = this.x + this.width;
            this.y2 = this.y + this.height
        },
        start: function () {
            this.is_paused = false
        },
        pause: function () {
            this.is_paused = true
        },
        hide: function () {
            this.is_visiable = false;
            this.onOut()
        },
        show: function () {
            this.is_visiable = true
        },
        del: function () {
            this.is_valid = false
        },
        on: function (c, b) {
            a.eventManager.on(this, c, b)
        },
        onEnter: a.lang.nullFunc,
        onOut: a.lang.nullFunc,
        onHover: a.lang.nullFunc,
        onClick: a.lang.nullFunc,
        step: a.lang.nullFunc,
        render: a.lang.nullFunc,
        addToScene: function (d, b, c, e) {
            this.scene = d;
            if (isNaN(b)) {
                return
            }
            this.step_level = b || this.step_level;
            this.render_level = c || this.render_level;
            if (e) {
                a.lang.each(e, function (f) {
                    d.addElement(f, b, c)
                })
            }
            d.addElement(this, b, c)
        }
    }
});
_TD.a.push(function (a) {
    var f = 20;
    var d = {
        _init: function (h) {
            h = h || {};
            this.grid_x = h.grid_x || 10;
            this.grid_y = h.grid_y || 10;
            this.x = h.x || 0;
            this.y = h.y || 0;
            this.width = this.grid_x * a.grid_size;
            this.height = this.grid_y * a.grid_size;
            this.x2 = this.x + this.width;
            this.y2 = this.y + this.width;
            this.grids = [];
            this.entrance = this.exit = null;
            this.buildings = [];
            this.monsters = [];
            this.bullets = [];
            this.scene = h.scene;
            this.is_main_map = !!h.is_main_map;
            this.select_hl = a.MapSelectHighLight(this.id + "-hl", {map: this});
            this.select_hl.addToScene(this.scene, 1, 9);
            this.selected_building = null;
            this._wait_clearInvalidElements = f;
            this._wait_add_monsters = 0;
            this._wait_add_monsters_arr = [];
            if (this.is_main_map) {
                this.mmm = new b(this.id + "-mmm", {map: this});
                this.mmm.addToScene(this.scene, 1, 7)
            }
            var m, g = this.grid_x * this.grid_y, j = h.grid_data || [], n, k;
            for (m = 0; m < g; m++) {
                n = j[m] || {};
                n.mx = m % this.grid_x;
                n.my = Math.floor(m / this.grid_x);
                n.map = this;
                n.step_level = this.step_level;
                n.render_level = this.render_level;
                k = new a.Grid(this.id + "-grid-" + n.mx + "-" + n.my, n);
                this.grids.push(k)
            }
            if (h.entrance && h.exit && !a.lang.arrayEqual(h.entrance, h.exit)) {
                this.entrance = this.getGrid(h.entrance[0], h.entrance[1]);
                this.entrance.is_entrance = true;
                this.exit = this.getGrid(h.exit[0], h.exit[1]);
                this.exit.is_exit = true
            }
            var o = this;
            if (h.grids_cfg) {
                a.lang.each(h.grids_cfg, function (l) {
                    var i = o.getGrid(l.pos[0], l.pos[1]);
                    if (!i) {
                        return
                    }
                    if (!isNaN(l.passable_flag)) {
                        i.passable_flag = l.passable_flag
                    }
                    if (!isNaN(l.build_flag)) {
                        i.build_flag = l.build_flag
                    }
                    if (l.building) {
                        i.addBuilding(l.building)
                    }
                })
            }
        }, checkHasWeapon: function () {
            this.has_weapon = (this.anyBuilding(function (g) {
                return g.is_weapon
            }) != null)
        }, getGrid: function (i, h) {
            var g = h * this.grid_x + i;
            return this.grids[g]
        }, anyMonster: function (g) {
            return a.lang.any(this.monsters, g)
        }, anyBuilding: function (g) {
            return a.lang.any(this.buildings, g)
        }, anyBullet: function (g) {
            return a.lang.any(this.bullets, g)
        }, eachBuilding: function (g) {
            a.lang.each(this.buildings, g)
        }, eachMonster: function (g) {
            a.lang.each(this.monsters, g)
        }, eachBullet: function (g) {
            a.lang.each(this.bullets, g)
        }, preBuild: function (g) {
            a.mode = "build";
            if (this.pre_building) {
                this.pre_building.remove()
            }
            this.pre_building = new a.Building(this.id + "-pre-building-" + a.lang.rndStr(), {
                type: g,
                map: this,
                is_pre_building: true
            });
            this.scene.addElement(this.pre_building, 1, this.render_level + 1)
        }, cancelPreBuild: function () {
            a.mode = "normal";
            if (this.pre_building) {
                this.pre_building.remove()
            }
        }, clearInvalidElements: function () {
            if (this._wait_clearInvalidElements > 0) {
                this._wait_clearInvalidElements--;
                return
            }
            this._wait_clearInvalidElements = f;
            var g = [];
            a.lang.shift(this.buildings, function (h) {
                if (h.is_valid) {
                    g.push(h)
                }
            });
            this.buildings = g;
            g = [];
            a.lang.shift(this.monsters, function (h) {
                if (h.is_valid) {
                    g.push(h)
                }
            });
            this.monsters = g;
            g = [];
            a.lang.shift(this.bullets, function (h) {
                if (h.is_valid) {
                    g.push(h)
                }
            });
            this.bullets = g
        }, addMonster: function (g) {
            if (!this.entrance) {
                return
            }
            if (typeof g == "number") {
                g = new a.Monster(null, {
                    idx: g,
                    difficulty: a.difficulty,
                    step_level: this.step_level,
                    render_level: this.render_level + 2
                })
            }
            this.entrance.addMonster(g)
        }, addMonsters: function (h, g) {
            this._wait_add_monsters = h;
            this._wait_add_monsters_objidx = g
        }, addMonsters2: function (g) {
            this._wait_add_monsters_arr = g
        }, checkPassable: function (i, h) {
            var g = this.getGrid(i, h);
            return (g != null && g.passable_flag == 1 && g.build_flag != 2)
        }, step: function () {
            this.clearInvalidElements();
            if (this._wait_add_monsters > 0) {
                this.addMonster(this._wait_add_monsters_objidx);
                this._wait_add_monsters--
            } else {
                if (this._wait_add_monsters_arr.length > 0) {
                    var g = this._wait_add_monsters_arr.shift();
                    this.addMonsters(g[0], g[1])
                }
            }
        }, render: function () {
            var g = a.ctx;
            g.strokeStyle = "#99a";
            g.lineWidth = 1;
            g.beginPath();
            g.strokeRect(this.x + 0.5, this.y + 0.5, this.width, this.height);
            g.closePath();
            g.stroke()
        }, onOut: function () {
            if (this.is_main_map && this.pre_building) {
                this.pre_building.hide()
            }
        }
    };
    a.Map = function (i, g) {
        g.on_events = ["enter", "out"];
        var h = new a.Element(i, g);
        a.lang.mix(h, d);
        h._init(g);
        return h
    };
    var c = {
        _init: function (g) {
            this.map = g.map;
            this.width = a.grid_size + 2;
            this.height = a.grid_size + 2;
            this.is_visiable = false
        }, show: function (g) {
            this.x = g.x;
            this.y = g.y;
            this.is_visiable = true
        }, render: function () {
            var g = a.ctx;
            g.lineWidth = 2;
            g.strokeStyle = "#f93";
            g.beginPath();
            g.strokeRect(this.x, this.y, this.width - 1, this.height - 1);
            g.closePath();
            g.stroke()
        }
    };
    a.MapSelectHighLight = function (i, g) {
        var h = new a.Element(i, g);
        a.lang.mix(h, c);
        h._init(g);
        return h
    };
    var e = {
        _init: function (g) {
            this.map = g.map;
            this.x1 = this.map.x;
            this.y1 = this.map.y;
            this.x2 = this.map.x2 + 1;
            this.y2 = this.map.y2 + 1;
            this.w = this.map.scene.stage.width;
            this.h = this.map.scene.stage.height;
            this.w2 = this.w - this.x2;
            this.h2 = this.h - this.y2
        }, render: function () {
            var g = a.ctx;
            g.fillStyle = "#fff";
            g.beginPath();
            g.fillRect(0, 0, this.x1, this.h);
            g.fillRect(0, 0, this.w, this.y1);
            g.fillRect(0, this.y2, this.w, this.h2);
            g.fillRect(this.x2, 0, this.w2, this.h);
            g.closePath();
            g.fill()
        }
    };

    function b(i, g) {
        var h = new a.Element(i, g);
        a.lang.mix(h, e);
        h._init(g);
        return h
    }
});
_TD.a.push(function (a) {
    var b = {
        _init: function (c) {
            c = c || {};
            this.map = c.map;
            this.scene = this.map.scene;
            this.mx = c.mx;
            this.my = c.my;
            this.width = a.grid_size;
            this.height = a.grid_size;
            this.is_entrance = this.is_exit = false;
            this.passable_flag = 1;
            this.build_flag = 1, this.building = null;
            this.caculatePos()
        }, caculatePos: function () {
            this.x = this.map.x + this.mx * a.grid_size;
            this.y = this.map.y + this.my * a.grid_size;
            this.x2 = this.x + a.grid_size;
            this.y2 = this.y + a.grid_size;
            this.cx = Math.floor(this.x + a.grid_size / 2);
            this.cy = Math.floor(this.y + a.grid_size / 2)
        }, checkBlock: function () {
            if (this.is_entrance || this.is_exit) {
                this._block_msg = a._t("entrance_or_exit_be_blocked");
                return true
            }
            var d, e = this,
                c = new a.FindWay(this.map.grid_x, this.map.grid_y, this.map.entrance.mx, this.map.entrance.my, this.map.exit.mx, this.map.exit.my, function (f, g) {
                    return !(f == e.mx && g == e.my) && e.map.checkPassable(f, g)
                });
            d = c.is_blocked;
            if (!d) {
                d = !!this.map.anyMonster(function (f) {
                    return f.chkIfBlocked(e.mx, e.my)
                });
                if (d) {
                    this._block_msg = a._t("monster_be_blocked")
                }
            } else {
                this._block_msg = a._t("blocked")
            }
            return d
        }, buyBuilding: function (c) {
            var d = a.getDefaultBuildingAttributes(c).cost || 0;
            if (a.money >= d) {
                a.money -= d;
                this.addBuilding(c)
            } else {
                a.log(a._t("not_enough_money", [d]));
                this.scene.panel.balloontip.msg(a._t("not_enough_money", [d]), this)
            }
        }, addBuilding: function (c) {
            if (this.building) {
                this.removeBuilding()
            }
            var d = new a.Building("building-" + c + "-" + a.lang.rndStr(), {
                type: c,
                step_level: this.step_level,
                render_level: this.render_level
            });
            d.locate(this);
            this.scene.addElement(d, this.step_level, this.render_level + 1);
            this.map.buildings.push(d);
            this.building = d;
            this.build_flag = 2;
            this.map.checkHasWeapon();
            if (this.map.pre_building) {
                this.map.pre_building.hide()
            }
        }, removeBuilding: function () {
            if (this.build_flag == 2) {
                this.build_flag = 1
            }
            if (this.building) {
                this.building.remove()
            }
            this.building = null
        }, addMonster: function (c) {
            c.beAddToGrid(this);
            this.map.monsters.push(c);
            c.start()
        }, hightLight: function (c) {
            this.map.select_hl[c ? "show" : "hide"](this)
        }, render: function () {
            var c = a.ctx, e = this.x + 0.5, d = this.y + 0.5;
            if (this.is_hover) {
                c.fillStyle = "rgba(255, 255, 200, 0.2)";
                c.beginPath();
                c.fillRect(e, d, this.width, this.height);
                c.closePath();
                c.fill()
            }
            if (this.passable_flag == 0) {
                c.fillStyle = "#fcc";
                c.beginPath();
                c.fillRect(e, d, this.width, this.height);
                c.closePath();
                c.fill()
            }
            if (this.is_entrance || this.is_exit) {
                c.lineWidth = 1;
                c.fillStyle = "#ccc";
                c.beginPath();
                c.fillRect(e, d, this.width, this.height);
                c.closePath();
                c.fill();
                c.strokeStyle = "#666";
                c.fillStyle = this.is_entrance ? "#fff" : "#666";
                c.beginPath();
                c.arc(this.cx, this.cy, a.grid_size * 0.325, 0, Math.PI * 2, true);
                c.closePath();
                c.fill();
                c.stroke()
            }
            c.strokeStyle = "#eee";
            c.lineWidth = 1;
            c.beginPath();
            c.strokeRect(e, d, this.width, this.height);
            c.closePath();
            c.stroke()
        }, onEnter: function () {
            if (this.map.is_main_map && a.mode == "build") {
                if (this.build_flag == 1) {
                    this.map.pre_building.show();
                    this.map.pre_building.locate(this)
                } else {
                    this.map.pre_building.hide()
                }
            } else {
                if (this.map.is_main_map) {
                    var c = "";
                    if (this.is_entrance) {
                        c = a._t("entrance")
                    } else {
                        if (this.is_exit) {
                            c = a._t("exit")
                        } else {
                            if (this.passable_flag == 0) {
                                c = a._t("_cant_pass")
                            } else {
                                if (this.build_flag == 0) {
                                    c = a._t("_cant_build")
                                }
                            }
                        }
                    }
                    if (c) {
                        this.scene.panel.balloontip.msg(c, this)
                    }
                }
            }
        }, onOut: function () {
            if (this.scene.panel.balloontip.el == this) {
                this.scene.panel.balloontip.hide()
            }
        }, onClick: function () {
            if (this.scene.state != 1) {
                return
            }
            if (a.mode == "build" && this.map.is_main_map && !this.building) {
                if (this.checkBlock()) {
                    this.scene.panel.balloontip.msg(this._block_msg, this)
                } else {
                    this.buyBuilding(this.map.pre_building.type)
                }
            } else {
                if (!this.building && this.map.selected_building) {
                    this.map.selected_building.toggleSelected();
                    this.map.selected_building = null
                }
            }
        }
    };
    a.Grid = function (e, c) {
        c.on_events = ["enter", "out", "click"];
        var d = new a.Element(e, c);
        a.lang.mix(d, b);
        d._init(c);
        return d
    }
});
_TD.a.push(function (a) {
    var c = {
        _init: function (d) {
            this.is_selected = false;
            this.level = 0;
            this.killed = 0;
            this.target = null;
            d = d || {};
            this.map = d.map || null;
            this.grid = d.grid || null;
            this.bullet_type = d.bullet_type || 1;
            this.type = d.type;
            this.speed = d.speed;
            this.bullet_speed = d.bullet_speed;
            this.is_pre_building = !!d.is_pre_building;
            this.blink = this.is_pre_building;
            this.wait_blink = this._default_wait_blink = 20;
            this.is_weapon = (this.type != "wall");
            var e = a.getDefaultBuildingAttributes(this.type);
            a.lang.mix(this, e);
            this.range_px = this.range * a.grid_size;
            this.money = this.cost;
            this.caculatePos()
        }, getUpgradeCost: function () {
            return Math.floor(this.money * 0.75)
        }, getSellMoney: function () {
            return Math.floor(this.money * 0.5) || 1
        }, toggleSelected: function () {
            this.is_selected = !this.is_selected;
            this.grid.hightLight(this.is_selected);
            var d = this;
            if (this.is_selected) {
                this.map.eachBuilding(function (e) {
                    e.is_selected = e == d
                });
                (this.map.is_main_map ? this.scene.panel_map : this.scene.map).eachBuilding(function (e) {
                    e.is_selected = false;
                    e.grid.hightLight(false)
                });
                this.map.selected_building = this;
                if (!this.map.is_main_map) {
                    this.scene.map.preBuild(this.type)
                } else {
                    this.scene.map.cancelPreBuild()
                }
            } else {
                if (this.map.selected_building == this) {
                    this.map.selected_building = null
                }
                if (!this.map.is_main_map) {
                    this.scene.map.cancelPreBuild()
                }
            }
            if (this.map.is_main_map) {
                if (this.map.selected_building) {
                    this.scene.panel.btn_upgrade.show();
                    this.scene.panel.btn_sell.show();
                    this.updateBtnDesc()
                } else {
                    this.scene.panel.btn_upgrade.hide();
                    this.scene.panel.btn_sell.hide()
                }
            }
        }, updateBtnDesc: function () {
            this.scene.panel.btn_upgrade.desc = a._t("upgrade", [a._t("building_name_" + this.type), this.level + 1, this.getUpgradeCost()]);
            this.scene.panel.btn_sell.desc = a._t("sell", [a._t("building_name_" + this.type), this.getSellMoney()])
        }, locate: function (d) {
            this.grid = d;
            this.map = d.map;
            this.cx = this.grid.cx;
            this.cy = this.grid.cy;
            this.x = this.grid.x;
            this.y = this.grid.y;
            this.x2 = this.grid.x2;
            this.y2 = this.grid.y2;
            this.width = this.grid.width;
            this.height = this.grid.height;
            this.px = this.x + 0.5;
            this.py = this.y + 0.5;
            this.wait_blink = this._default_wait_blink;
            this._fire_wait = Math.floor(Math.max(2 / (this.speed * a.global_speed), 1));
            this._fire_wait2 = this._fire_wait
        }, remove: function () {
            if (this.grid && this.grid.building && this.grid.building == this) {
                this.grid.building = null
            }
            this.hide();
            this.del()
        }, findTaget: function () {
            if (!this.is_weapon || this.is_pre_building || !this.grid) {
                return
            }
            var e = this.cx, f = this.cy, d = Math.pow(this.range_px, 2);
            if (this.target && this.target.is_valid && Math.pow(this.target.cx - e, 2) + Math.pow(this.target.cy - f, 2) <= d) {
                return
            }
            this.target = a.lang.any(a.lang.rndSort(this.map.monsters), function (g) {
                return Math.pow(g.cx - e, 2) + Math.pow(g.cy - f, 2) <= d
            })
        }, getTargetPosition: function () {
            if (!this.target) {
                var d = this.map.is_main_map ? this.map.entrance : this.grid;
                return [d.cx, d.cy]
            }
            return [this.target.cx, this.target.cy]
        }, fire: function () {
            if (!this.target || !this.target.is_valid) {
                return
            }
            if (this.type == "laser_gun") {
                this.target.beHit(this, this.damage);
                return
            }
            var e = this.muzzle || [this.cx, this.cy], d = e[0], f = e[1];
            new a.Bullet(null, {
                building: this,
                damage: this.damage,
                target: this.target,
                speed: this.bullet_speed,
                x: d,
                y: f
            })
        }, tryToFire: function () {
            if (!this.is_weapon || !this.target) {
                return
            }
            this._fire_wait--;
            if (this._fire_wait > 0) {
            } else {
                if (this._fire_wait < 0) {
                    this._fire_wait = this._fire_wait2
                } else {
                    this.fire()
                }
            }
        }, _upgrade2: function (f) {
            if (!this._upgrade_records[f]) {
                this._upgrade_records[f] = this[f]
            }
            var e = this._upgrade_records[f], d = "max_" + f, g = "_upgrade_rule_" + f,
                h = this[g] || a.default_upgrade_rule;
            if (!e || isNaN(e)) {
                return
            }
            e = h(this.level, e);
            if (this[d] && !isNaN(this[d]) && this[d] < e) {
                e = this[d]
            }
            this._upgrade_records[f] = e;
            this[f] = Math.floor(e)
        }, upgrade: function () {
            if (!this._upgrade_records) {
                this._upgrade_records = {}
            }
            var e = ["damage", "range", "speed", "life", "shield"], f, d = e.length;
            for (f = 0; f < d; f++) {
                this._upgrade2(e[f])
            }
            this.level++;
            this.range_px = this.range * a.grid_size
        }, tryToUpgrade: function (d) {
            var f = this.getUpgradeCost(), e = "";
            if (f > a.money) {
                e = a._t("not_enough_money", [f])
            } else {
                a.money -= f;
                this.money += f;
                this.upgrade();
                e = a._t("upgrade_success", [a._t("building_name_" + this.type), this.level, this.getUpgradeCost()])
            }
            this.updateBtnDesc();
            this.scene.panel.balloontip.msg(e, d)
        }, tryToSell: function () {
            if (!this.is_valid) {
                return
            }
            a.money += this.getSellMoney();
            this.grid.removeBuilding();
            this.is_valid = false;
            this.map.selected_building = null;
            this.map.select_hl.hide();
            this.map.checkHasWeapon();
            this.scene.panel.btn_upgrade.hide();
            this.scene.panel.btn_sell.hide();
            this.scene.panel.balloontip.hide()
        }, step: function () {
            if (this.blink) {
                this.wait_blink--;
                if (this.wait_blink < -this._default_wait_blink) {
                    this.wait_blink = this._default_wait_blink
                }
            }
            this.findTaget();
            this.tryToFire()
        }, render: function () {
            if (!this.is_visiable || this.wait_blink < 0) {
                return
            }
            var d = a.ctx;
            a.renderBuilding(this);
            if (this.map.is_main_map && (this.is_selected || (this.is_pre_building) || this.map.show_all_ranges) && this.is_weapon && this.range > 0 && this.grid) {
                d.lineWidth = 1;
                d.fillStyle = "rgba(187, 141, 32, 0.15)";
                d.strokeStyle = "#bb8d20";
                d.beginPath();
                d.arc(this.cx, this.cy, this.range_px, 0, Math.PI * 2, true);
                d.closePath();
                d.fill();
                d.stroke()
            }
            if (this.type == "laser_gun" && this.target && this.target.is_valid) {
                d.lineWidth = 3;
                d.strokeStyle = "rgba(50, 50, 200, 0.5)";
                d.beginPath();
                d.moveTo(this.cx, this.cy);
                d.lineTo(this.target.cx, this.target.cy);
                d.closePath();
                d.stroke();
                d.lineWidth = 1;
                d.strokeStyle = "rgba(150, 150, 255, 0.5)";
                d.beginPath();
                d.lineTo(this.cx, this.cy);
                d.closePath();
                d.stroke()
            }
        }, onEnter: function () {
            if (this.is_pre_building) {
                return
            }
            var d = "\u5efa\u7b51\u5de5\u4e8b";
            if (this.map.is_main_map) {
                d = a._t("building_info" + (this.type == "wall" ? "_wall" : ""), [a._t("building_name_" + this.type), this.level, this.damage, this.speed, this.range, this.killed])
            } else {
                d = a._t("building_intro_" + this.type, [a.getDefaultBuildingAttributes(this.type).cost])
            }
            this.scene.panel.balloontip.msg(d, this.grid)
        }, onOut: function () {
            if (this.scene.panel.balloontip.el == this.grid) {
                this.scene.panel.balloontip.hide()
            }
        }, onClick: function () {
            if (this.is_pre_building || this.scene.state != 1) {
                return
            }
            this.toggleSelected()
        }
    };
    a.Building = function (f, d) {
        d.on_events = ["enter", "out", "click"];
        var e = new a.Element(f, d);
        a.lang.mix(e, c);
        e._init(d);
        return e
    };
    var b = {
        _init: function (d) {
            d = d || {};
            this.speed = d.speed;
            this.damage = d.damage;
            this.target = d.target;
            this.cx = d.x;
            this.cy = d.y;
            this.r = d.r || Math.max(Math.log(this.damage), 2);
            if (this.r < 1) {
                this.r = 1
            }
            if (this.r > 6) {
                this.r = 6
            }
            this.building = d.building || null;
            this.map = d.map || this.building.map;
            this.type = d.type || 1;
            this.color = d.color || "#000";
            this.map.bullets.push(this);
            this.addToScene(this.map.scene, 1, 6);
            if (this.type == 1) {
                this.caculate()
            }
        }, caculate: function () {
            var i, g, h, e = this.target.cx, d = this.target.cy, f;
            i = e - this.cx;
            g = d - this.cy;
            h = Math.sqrt(Math.pow(i, 2) + Math.pow(g, 2)), f = 20 * this.speed * a.global_speed, this.vx = i * f / h, this.vy = g * f / h
        }, checkOutOfMap: function () {
            this.is_valid = !(this.cx < this.map.x || this.cx > this.map.x2 || this.cy < this.map.y || this.cy > this.map.y2);
            return !this.is_valid
        }, checkHit: function () {
            var d = this.cx, g = this.cy, f = this.r, e = this.map.anyMonster(function (h) {
                return Math.pow(h.cx - d, 2) + Math.pow(h.cy - g, 2) <= Math.pow(h.r + f, 2) * 2
            });
            if (e) {
                e.beHit(this.building, this.damage);
                this.is_valid = false;
                a.Explode(this.id + "-explode", {
                    cx: this.cx,
                    cy: this.cy,
                    r: this.r,
                    step_level: this.step_level,
                    render_level: this.render_level,
                    color: this.color,
                    scene: this.map.scene,
                    time: 0.2
                });
                return true
            }
            return false
        }, step: function () {
            if (this.checkOutOfMap() || this.checkHit()) {
                return
            }
            this.cx += this.vx;
            this.cy += this.vy
        }, render: function () {
            var d = a.ctx;
            d.fillStyle = this.color;
            d.beginPath();
            d.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
            d.closePath();
            d.fill()
        }
    };
    a.Bullet = function (f, e) {
        var d = new a.Element(f, e);
        a.lang.mix(d, b);
        d._init(e);
        return d
    }
});
_TD.a.push(function (a) {
    var b = {
        _init: function (e) {
            e = e || {};
            this.is_monster = true;
            this.idx = e.idx || 1;
            this.difficulty = e.difficulty || 1;
            var d = a.getDefaultMonsterAttributes(this.idx);
            this.speed = Math.floor((d.speed + this.difficulty / 2) * (Math.random() * 0.5 + 0.75));
            if (this.speed < 1) {
                this.speed = 1
            }
            if (this.speed > e.max_speed) {
                this.speed = e.max_speed
            }
            this.life = this.life0 = Math.floor(d.life * (this.difficulty + 1) * (Math.random() + 0.5) * 0.5);
            if (this.life < 1) {
                this.life = this.life0 = 1
            }
            this.shield = Math.floor(d.shield + this.difficulty / 2);
            if (this.shield < 0) {
                this.shield = 0
            }
            this.damage = Math.floor((d.damage || 1) * (Math.random() * 0.5 + 0.75));
            if (this.damage < 1) {
                this.damage = 1
            }
            this.money = d.money || Math.floor(Math.sqrt((this.speed + this.life) * (this.shield + 1) * this.damage));
            if (this.money < 1) {
                this.money = 1
            }
            this.color = d.color || a.lang.rndRGB();
            this.r = Math.floor(this.damage * 1.2);
            if (this.r < 4) {
                this.r = 4
            }
            if (this.r > a.grid_size / 2 - 4) {
                this.r = a.grid_size / 2 - 4
            }
            this.render = d.render;
            this.grid = null;
            this.map = null;
            this.next_grid = null;
            this.way = [];
            this.toward = 2;
            this._dx = 0;
            this._dy = 0;
            this.is_blocked = false
        }, caculatePos: function () {
            var d = this.r;
            this.x = this.cx - d;
            this.y = this.cy - d;
            this.x2 = this.cx + d;
            this.y2 = this.cy + d
        }, beHit: function (d, e) {
            if (!this.is_valid) {
                return
            }
            var g = Math.ceil(e * 0.1);
            e -= this.shield;
            if (e <= g) {
                e = g
            }
            this.life -= e;
            a.score += Math.floor(Math.sqrt(e));
            if (this.life <= 0) {
                this.beKilled(d)
            }
            var f = this.scene.panel.balloontip;
            if (f.el == this) {
                f.text = a._t("monster_info", [this.life, this.shield, this.speed, this.damage])
            }
        }, beKilled: function (d) {
            if (!this.is_valid) {
                return
            }
            this.life = 0;
            this.is_valid = false;
            a.money += this.money;
            d.killed++;
            a.Explode(this.id + "-explode", {
                cx: this.cx,
                cy: this.cy,
                color: this.color,
                r: this.r,
                step_level: this.step_level,
                render_level: this.render_level,
                scene: this.grid.scene
            })
        }, arrive: function () {
            this.grid = this.next_grid;
            this.next_grid = null;
            this.checkFinish()
        }, findWay: function () {
            var e = this;
            var d = new a.FindWay(this.map.grid_x, this.map.grid_y, this.grid.mx, this.grid.my, this.map.exit.mx, this.map.exit.my, function (f, g) {
                return e.map.checkPassable(f, g)
            });
            this.way = d.way;
            delete d
        }, checkFinish: function () {
            if (this.grid && this.map && this.grid == this.map.exit) {
                a.life -= this.damage;
                a.wave_damage += this.damage;
                if (a.life <= 0) {
                    a.life = 0;
                    a.stage.gameover()
                } else {
                    this.pause();
                    this.del()
                }
            }
        }, beAddToGrid: function (d) {
            this.grid = d;
            this.map = d.map;
            this.cx = d.cx;
            this.cy = d.cy;
            this.grid.scene.addElement(this)
        }, getToward: function () {
            if (!this.grid || !this.next_grid) {
                return
            }
            if (this.grid.my < this.next_grid.my) {
                this.toward = 0
            } else {
                if (this.grid.mx < this.next_grid.mx) {
                    this.toward = 1
                } else {
                    if (this.grid.my > this.next_grid.my) {
                        this.toward = 2
                    } else {
                        if (this.grid.mx > this.next_grid.mx) {
                            this.toward = 3
                        }
                    }
                }
            }
        }, getNextGrid: function () {
            if (this.way.length == 0 || Math.random() < 0.1) {
                this.findWay()
            }
            var d = this.way.shift();
            if (d && !this.map.checkPassable(d[0], d[1])) {
                this.findWay();
                d = this.way.shift()
            }
            if (!d) {
                return
            }
            this.next_grid = this.map.getGrid(d[0], d[1])
        }, chkIfBlocked: function (f, e) {
            var g = this,
                d = new a.FindWay(this.map.grid_x, this.map.grid_y, this.grid.mx, this.grid.my, this.map.exit.mx, this.map.exit.my, function (h, i) {
                    return !(h == f && i == e) && g.map.checkPassable(h, i)
                });
            return d.is_blocked
        }, beBlocked: function () {
            if (this.is_blocked) {
                return
            }
            this.is_blocked = true;
            a.log("monster be blocked!")
        }, step: function () {
            if (!this.is_valid || this.is_paused || !this.grid) {
                return
            }
            if (!this.next_grid) {
                this.getNextGrid();
                if (!this.next_grid) {
                    this.beBlocked();
                    return
                }
            }
            if (this.cx == this.next_grid.cx && this.cy == this.next_grid.cy) {
                this.arrive()
            } else {
                var d = this.next_grid.cx - this.cx, h = this.next_grid.cy - this.cy, g = d < 0 ? -1 : 1,
                    f = h < 0 ? -1 : 1, e = this.speed * a.global_speed;
                if (Math.abs(d) < e && Math.abs(h) < e) {
                    this.cx = this.next_grid.cx;
                    this.cy = this.next_grid.cy;
                    this._dx = e - Math.abs(d);
                    this._dy = e - Math.abs(h)
                } else {
                    this.cx += d == 0 ? 0 : g * (e + this._dx);
                    this.cy += h == 0 ? 0 : f * (e + this._dy);
                    this._dx = 0;
                    this._dy = 0
                }
            }
            this.caculatePos()
        }, onEnter: function () {
            var e, d = this.scene.panel.balloontip;
            if (d.el == this) {
                d.hide();
                d.el = null
            } else {
                e = a._t("monster_info", [this.life, this.shield, this.speed, this.damage]), d.msg(e, this)
            }
        }, onOut: function () {
        }
    };
    a.Monster = function (f, d) {
        d.on_events = ["enter", "out"];
        var e = new a.Element(f, d);
        a.lang.mix(e, b);
        e._init(d);
        return e
    };
    var c = {
        _init: function (d) {
            d = d || {};
            var e = a.lang.rgb2Arr(d.color);
            this.cx = d.cx;
            this.cy = d.cy;
            this.r = d.r;
            this.step_level = d.step_level;
            this.render_level = d.render_level;
            this.rgb_r = e[0];
            this.rgb_g = e[1];
            this.rgb_b = e[2];
            this.rgb_a = 1;
            this.wait = this.wait0 = a.exp_fps * (d.time || 1);
            d.scene.addElement(this)
        }, step: function () {
            if (!this.is_valid) {
                return
            }
            this.wait--;
            this.r++;
            this.is_valid = this.wait > 0;
            this.rgb_a = this.wait / this.wait0
        }, render: function () {
            var d = a.ctx;
            d.fillStyle = "rgba(" + this.rgb_r + "," + this.rgb_g + "," + this.rgb_b + "," + this.rgb_a + ")";
            d.beginPath();
            d.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
            d.closePath();
            d.fill()
        }
    };
    a.Explode = function (f, d) {
        var e = new a.Element(f, d);
        a.lang.mix(e, c);
        e._init(d);
        return e
    }
});
_TD.a.push(function (a) {
    var d = {
        _init: function (f) {
            f = f || {};
            this.x = f.x;
            this.y = f.y;
            this.scene = f.scene;
            this.map = f.main_map;
            var g = new a.Map("panel-map", a.lang.mix({
                x: this.x + f.map.x,
                y: this.y + f.map.y,
                scene: this.scene,
                step_level: this.step_level,
                render_level: this.render_level
            }, f.map, false));
            this.addToScene(this.scene, 1, 7);
            g.addToScene(this.scene, 1, 7, g.grids);
            this.scene.panel_map = g;
            this.gameover_obj = new a.GameOver("panel-gameover", {
                panel: this,
                scene: this.scene,
                step_level: this.step_level,
                is_visiable: false,
                x: 0,
                y: 0,
                width: this.scene.stage.width,
                height: this.scene.stage.height,
                render_level: 9
            });
            this.balloontip = new a.BalloonTip("panel-balloon-tip", {
                scene: this.scene,
                step_level: this.step_level,
                render_level: 9
            });
            this.balloontip.addToScene(this.scene, 1, 9);
            this.btn_pause = new a.Button("panel-btn-pause", {
                scene: this.scene,
                x: this.x,
                y: this.y + 260,
                text: a._t("button_pause_text"),
                step_level: this.step_level,
                render_level: this.render_level + 1,
                onClick: function () {
                    if (this.scene.state == 1) {
                        this.scene.pause();
                        this.text = a._t("button_continue_text");
                        this.scene.panel.btn_upgrade.hide();
                        this.scene.panel.btn_sell.hide();
                        this.scene.panel.btn_restart.show()
                    } else {
                        if (this.scene.state == 2) {
                            this.scene.start();
                            this.text = a._t("button_pause_text");
                            this.scene.panel.btn_restart.hide();
                            if (this.scene.map.selected_building) {
                                this.scene.panel.btn_upgrade.show();
                                this.scene.panel.btn_sell.show()
                            }
                        }
                    }
                }
            });
            this.btn_restart = new a.Button("panel-btn-restart", {
                scene: this.scene,
                x: this.x,
                y: this.y + 300,
                is_visiable: false,
                text: a._t("button_restart_text"),
                step_level: this.step_level,
                render_level: this.render_level + 1,
                onClick: function () {
                    setTimeout(function () {
                        a.stage.clear();
                        a.is_paused = true;
                        a.start();
                        a.mouseHand(false)
                    }, 0)
                }
            });
            this.btn_upgrade = new a.Button("panel-btn-upgrade", {
                scene: this.scene,
                x: this.x,
                y: this.y + 300,
                is_visiable: false,
                text: a._t("button_upgrade_text"),
                step_level: this.step_level,
                render_level: this.render_level + 1,
                onClick: function () {
                    this.scene.map.selected_building.tryToUpgrade(this)
                }
            });
            this.btn_sell = new a.Button("panel-btn-sell", {
                scene: this.scene,
                x: this.x,
                y: this.y + 340,
                is_visiable: false,
                text: a._t("button_sell_text"),
                step_level: this.step_level,
                render_level: this.render_level + 1,
                onClick: function () {
                    this.scene.map.selected_building.tryToSell(this)
                }
            })
        }, step: function () {
            if (a.life_recover) {
                this._life_recover = this._life_recover2 = a.life_recover;
                this._life_recover_wait = this._life_recover_wait2 = a.exp_fps * 3;
                a.life_recover = 0
            }
            if (this._life_recover && (a.iframe % a.exp_fps_eighth == 0)) {
                a.life++;
                this._life_recover--
            }
        }, render: function () {
            var g = a.ctx;
            g.textAlign = "left";
            g.textBaseline = "top";
            g.fillStyle = "#000";
            g.font = "normal 12px 'Courier New'";
            g.beginPath();
            g.fillText(a._t("panel_money_title") + a.money, this.x, this.y);
            g.fillText(a._t("panel_score_title") + a.score, this.x, this.y + 20);
            g.fillText(a._t("panel_life_title") + a.life, this.x, this.y + 40);
            g.fillText(a._t("panel_building_title") + this.map.buildings.length, this.x, this.y + 60);
            g.fillText(a._t("panel_monster_title") + this.map.monsters.length, this.x, this.y + 80);
            g.fillText(a._t("wave_info", [this.scene.wave]), this.x, this.y + 210);
            g.closePath();
            if (this._life_recover_wait) {
                var f = this._life_recover_wait / this._life_recover_wait2;
                g.fillStyle = "rgba(255, 0, 0, " + f + ")";
                g.font = "bold 12px 'Verdana'";
                g.beginPath();
                g.fillText("+" + this._life_recover2, this.x + 60, this.y + 40);
                g.closePath();
                this._life_recover_wait--
            }
            g.textAlign = "right";
            g.fillStyle = "#666";
            g.font = "normal 12px 'Courier New'";
            g.beginPath();
            g.fillText("version: " + a.version + " | oldj.net", a.stage.width - a.padding, a.stage.height - a.padding * 2);
            g.closePath();
            g.textAlign = "left";
            g.fillStyle = "#666";
            g.font = "normal 12px 'Courier New'";
            g.beginPath();
            g.fillText("FPS: " + a.fps, a.padding, a.stage.height - a.padding * 2);
            g.closePath()
        }
    };
    a.Panel = function (h, g) {
        var f = new a.Element(h, g);
        a.lang.mix(f, d);
        f._init(g);
        return f
    };
    var b = {
        _init: function (f) {
            f = f || {};
            this.scene = f.scene
        }, caculatePos: function () {
            var f = this.el;
            this.x = f.cx + 0.5;
            this.y = f.cy + 0.5;
            if (this.x + this.width > this.scene.stage.width - a.padding) {
                this.x = this.x - this.width
            }
            this.px = this.x + 5;
            this.py = this.y + 4
        }, msg: function (f, h) {
            this.text = f;
            var g = a.ctx;
            g.font = "normal 12px 'Courier New'";
            this.width = Math.max(g.measureText(f).width + 10, a.lang.strLen2(f) * 6 + 10);
            this.height = 24;
            if (h && h.cx && h.cy) {
                this.el = h;
                this.caculatePos();
                this.show()
            }
        }, step: function () {
            if (!this.el || !this.el.is_valid) {
                this.hide();
                return
            }
            if (this.el.is_monster) {
                this.caculatePos()
            }
        }, render: function () {
            if (!this.el) {
                return
            }
            var f = a.ctx;
            f.lineWidth = 1;
            f.fillStyle = "rgba(255, 255, 0, 0.5)";
            f.strokeStyle = "rgba(222, 222, 0, 0.9)";
            f.beginPath();
            f.rect(this.x, this.y, this.width, this.height);
            f.closePath();
            f.fill();
            f.stroke();
            f.textAlign = "left";
            f.textBaseline = "top";
            f.fillStyle = "#000";
            f.font = "normal 12px 'Courier New'";
            f.beginPath();
            f.fillText(this.text, this.px, this.py);
            f.closePath()
        }
    };
    a.BalloonTip = function (h, f) {
        var g = new a.Element(h, f);
        a.lang.mix(g, b);
        g._init(f);
        return g
    };
    var e = {
        _init: function (f) {
            f = f || {};
            this.text = f.text;
            this.onClick = f.onClick || a.lang.nullFunc;
            this.x = f.x;
            this.y = f.y;
            this.width = f.width || 80;
            this.height = f.height || 30;
            this.font_x = this.x + 8;
            this.font_y = this.y + 7;
            this.scene = f.scene;
            this.desc = f.desc || "";
            this.addToScene(this.scene, this.step_level, this.render_level);
            this.caculatePos()
        }, onEnter: function () {
            a.mouseHand(true);
            if (this.desc) {
                this.scene.panel.balloontip.msg(this.desc, this)
            }
        }, onOut: function () {
            a.mouseHand(false);
            if (this.scene.panel.balloontip.el == this) {
                this.scene.panel.balloontip.hide()
            }
        }, render: function () {
            var f = a.ctx;
            f.lineWidth = 2;
            f.fillStyle = this.is_hover ? "#eee" : "#ccc";
            f.strokeStyle = "#999";
            f.beginPath();
            f.rect(this.x, this.y, this.width, this.height);
            f.closePath();
            f.fill();
            f.stroke();
            f.textAlign = "left";
            f.textBaseline = "top";
            f.fillStyle = "#000";
            f.font = "normal 12px 'Courier New'";
            f.beginPath();
            f.fillText(this.text, this.font_x, this.font_y);
            f.closePath();
            f.fill()
        }
    };
    a.Button = function (h, f) {
        f.on_events = ["enter", "out", "click"];
        var g = new a.Element(h, f);
        a.lang.mix(g, e);
        g._init(f);
        return g
    };
    var c = {
        _init: function (f) {
            this.panel = f.panel;
            this.scene = f.scene;
            this.addToScene(this.scene, 1, 9)
        }, render: function () {
            this.panel.btn_pause.hide();
            this.panel.btn_upgrade.hide();
            this.panel.btn_sell.hide();
            this.panel.btn_restart.show();
            var f = a.ctx;
            f.textAlign = "center";
            f.textBaseline = "middle";
            f.fillStyle = "#ccc";
            f.font = "bold 62px 'Verdana'";
            f.beginPath();
            f.fillText("GAME OVER", this.width / 2, this.height / 2);
            f.closePath();
            f.fillStyle = "#f00";
            f.font = "bold 60px 'Verdana'";
            f.beginPath();
            f.fillText("GAME OVER", this.width / 2, this.height / 2);
            f.closePath()
        }
    };
    a.GameOver = function (h, f) {
        var g = new a.Element(h, f);
        a.lang.mix(g, c);
        g._init(f);
        return g
    };
    a.recover = function (f) {
        a.life_recover = f;
        a.log("life recover: " + f)
    }
});
_TD.a.push(function (a) {
    var c = function () {
        var e = new a.Act(this, "act-1"), g = new a.Scene(e, "scene-1"), d = a.getDefaultStageData("scene_endless");
        this.config = d.config;
        a.life = this.config.life;
        a.money = this.config.money;
        a.score = this.config.score;
        a.difficulty = this.config.difficulty;
        a.wave_damage = this.config.wave_damage;
        var f = new a.Map("main-map", a.lang.mix({scene: g, is_main_map: true, step_level: 1, render_level: 2}, d.map));
        f.addToScene(g, 1, 2, f.grids);
        g.map = f;
        g.panel = new a.Panel("panel", a.lang.mix({scene: g, main_map: f, step_level: 1, render_level: 7}, d.panel));
        this.newWave = d.newWave;
        this.map = f;
        this.wait_new_wave = this.config.wait_new_wave
    }, b = function () {
        var f = this.current_act.current_scene, d = f.wave;
        if ((d == 0 && !this.map.has_weapon) || f.state != 1) {
            return
        }
        if (this.map.monsters.length == 0) {
            if (d > 0 && this.wait_new_wave == this.config.wait_new_wave - 1) {
                var e = 0;
                if (d % 10 == 0) {
                    e = 10
                } else {
                    if (d % 5 == 0) {
                        e = 5
                    }
                }
                if (a.life + e > 100) {
                    e = 100 - a.life
                }
                if (e > 0) {
                    a.recover(e)
                }
            }
            if (this.wait_new_wave > 0) {
                this.wait_new_wave--;
                return
            }
            this.wait_new_wave = this.config.wait_new_wave;
            d++;
            f.wave = d;
            this.newWave({map: this.map, wave: d})
        }
    };
    a.getDefaultStageData = function (d) {
        var e = {
            stage_main: {width: 640, height: 560, init: c, step2: b},
            scene_endless: {
                map: {
                    grid_x: 16,
                    grid_y: 16,
                    x: a.padding,
                    y: a.padding,
                    entrance: [0, 0],
                    exit: [15, 15],
                    grids_cfg: [{pos: [3, 3], passable_flag: 0}, {pos: [7, 15], build_flag: 0}, {
                        pos: [4, 12],
                        building: "wall"
                    }, {pos: [4, 13], building: "wall"}]
                },
                panel: {
                    x: a.padding * 2 + a.grid_size * 16,
                    y: a.padding,
                    map: {
                        grid_x: 3,
                        grid_y: 3,
                        x: 0,
                        y: 110,
                        grids_cfg: [{pos: [0, 0], building: "cannon"}, {pos: [1, 0], building: "LMG"}, {
                            pos: [2, 0],
                            building: "HMG"
                        }, {pos: [0, 1], building: "laser_gun"}, {pos: [2, 2], building: "wall"}]
                    }
                },
                config: {
                    endless: true,
                    wait_new_wave: a.exp_fps * 3,
                    difficulty: 1,
                    wave: 0,
                    max_wave: -1,
                    wave_damage: 0,
                    max_monsters_per_wave: 100,
                    money: 5000000,
                    score: 0,
                    life: 100,
                    waves: [[], [[1, 0]], [[1, 0], [1, 1]], [[2, 0], [1, 1]], [[2, 0], [1, 1]], [[3, 0], [2, 1]], [[4, 0], [2, 1]], [[5, 0], [3, 1], [1, 2]], [[6, 0], [4, 1], [1, 2]], [[7, 0], [3, 1], [2, 2]], [[8, 0], [4, 1], [3, 2]]]
                },
                newWave: function (g) {
                    g = g || {};
                    var j = g.map, i = g.wave || 1, h = a.wave_damage || 0;
                    if (i == 1) {
                    } else {
                        if (h == 0) {
                            if (i < 5) {
                                a.difficulty *= 1.05
                            } else {
                                if (a.difficulty > 30) {
                                    a.difficulty *= 1.1
                                } else {
                                    a.difficulty *= 1.2
                                }
                            }
                        } else {
                            if (a.wave_damage >= 50) {
                                a.difficulty *= 0.6
                            } else {
                                if (a.wave_damage >= 30) {
                                    a.difficulty *= 0.7
                                } else {
                                    if (a.wave_damage >= 20) {
                                        a.difficulty *= 0.8
                                    } else {
                                        if (a.wave_damage >= 10) {
                                            a.difficulty *= 0.9
                                        } else {
                                            if (i >= 10) {
                                                a.difficulty *= 1.05
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (a.difficulty < 1) {
                        a.difficulty = 1
                    }
                    a.log("wave " + i + ", last wave damage = " + h + ", difficulty = " + a.difficulty);
                    var f = this.config.waves[i] || a.makeMonsters(Math.min(Math.floor(Math.pow(i, 1.1)), this.config.max_monsters_per_wave));
                    j.addMonsters2(f);
                    a.wave_damage = 0
                }
            }
        };
        return e[d] || {}
    }
});
_TD.a.push(function (a) {
    a.default_upgrade_rule = function (c, b) {
        return b * 1.2
    };
    a.getDefaultBuildingAttributes = function (b) {
        var c = {
            wall: {damage: 0, range: 0, speed: 0, bullet_speed: 0, life: 100, shield: 500, cost: 5},
            cannon: {
                damage: 12,
                range: 4,
                max_range: 8,
                speed: 2,
                bullet_speed: 6,
                life: 100,
                shield: 100,
                cost: 300,
                _upgrade_rule_damage: function (e, d) {
                    return d * (e <= 10 ? 1.2 : 1.3)
                }
            },
            LMG: {damage: 5, range: 5, max_range: 10, speed: 3, bullet_speed: 6, life: 100, shield: 50, cost: 100},
            HMG: {
                damage: 30,
                range: 3,
                max_range: 5,
                speed: 3,
                bullet_speed: 5,
                life: 100,
                shield: 200,
                cost: 800,
                _upgrade_rule_damage: function (e, d) {
                    return d * 1.3
                }
            },
            laser_gun: {damage: 25, range: 6, max_range: 10, speed: 20, life: 100, shield: 100, cost: 2000}
        };
        return c[b] || {}
    }
});
_TD.a.push(function (a) {
    function b() {
        if (!this.is_valid || !this.grid) {
            return
        }
        var d = a.ctx;
        d.strokeStyle = "#000";
        d.lineWidth = 1;
        d.fillStyle = this.color;
        d.beginPath();
        d.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
        d.closePath();
        d.fill();
        d.stroke();
        if (a.show_monster_life) {
            var e = Math.floor(a.grid_size / 4), c = e * 2 - 2;
            d.fillStyle = "#000";
            d.beginPath();
            d.fillRect(this.cx - e, this.cy - this.r - 6, e * 2, 4);
            d.closePath();
            d.fillStyle = "#f00";
            d.beginPath();
            d.fillRect(this.cx - e + 1, this.cy - this.r - 5, this.life * c / this.life0, 2);
            d.closePath()
        }
    }

    a.getDefaultMonsterAttributes = function (f) {
        var d = [{
            name: "monster 1",
            desc: "\u6700\u5f31\u5c0f\u7684\u602a\u7269",
            speed: 3,
            max_speed: 10,
            life: 50,
            damage: 1,
            shield: 0,
            money: 5
        }, {
            name: "monster 2",
            desc: "\u7a0d\u5f3a\u4e00\u4e9b\u7684\u5c0f\u602a",
            speed: 6,
            max_speed: 20,
            life: 50,
            damage: 2,
            shield: 1
        }, {
            name: "monster speed",
            desc: "\u901f\u5ea6\u8f83\u5feb\u7684\u5c0f\u602a",
            speed: 12,
            max_speed: 30,
            life: 50,
            damage: 3,
            shield: 1
        }, {
            name: "monster life",
            desc: "\u751f\u547d\u503c\u5f88\u5f3a\u7684\u5c0f\u602a",
            speed: 5,
            max_speed: 10,
            life: 500,
            damage: 3,
            shield: 1
        }, {
            name: "monster shield",
            desc: "\u9632\u5fa1\u5f88\u5f3a\u7684\u5c0f\u602a",
            speed: 5,
            max_speed: 10,
            life: 50,
            damage: 3,
            shield: 20
        }, {
            name: "monster damage",
            desc: "\u4f24\u5bb3\u503c\u5f88\u5927\u7684\u5c0f\u602a",
            speed: 7,
            max_speed: 14,
            life: 50,
            damage: 10,
            shield: 2
        }, {
            name: "monster speed-life",
            desc: "\u901f\u5ea6\u3001\u751f\u547d\u90fd\u8f83\u9ad8\u7684\u602a\u7269",
            speed: 15,
            max_speed: 30,
            life: 100,
            damage: 3,
            shield: 3
        }, {
            name: "monster speed-2",
            desc: "\u901f\u5ea6\u5f88\u5feb\u7684\u602a\u7269",
            speed: 30,
            max_speed: 40,
            life: 30,
            damage: 4,
            shield: 1
        }, {
            name: "monster shield-life",
            desc: "\u9632\u5fa1\u5f88\u5f3a\u3001\u751f\u547d\u503c\u5f88\u9ad8\u7684\u602a\u7269",
            speed: 3,
            max_speed: 10,
            life: 300,
            damage: 5,
            shield: 15
        }];
        if (typeof f == "undefined") {
            return d.length
        }
        var c = d[f] || d[0], e = {};
        a.lang.mix(e, c);
        if (!e.render) {
            e.render = b
        }
        return e
    };
    a.makeMonsters = function (f, j) {
        var p = [], k = 0, h, o, m, e, g = a.monster_type_count;
        if (!j) {
            j = [];
            for (h = 0; h < g; h++) {
                j.push(h)
            }
        }
        while (k < f) {
            m = f - k;
            o = Math.min(Math.floor(Math.random() * m) + 1, 3);
            e = Math.floor(Math.random() * g);
            p.push([o, j[e]]);
            k += o
        }
        return p
    }
});
_TD.a.push(function (b) {
    function c(s, h, r, g, q, k) {
        var e, n, o, m, f, i, d, l, j;
        if (h == g) {
            e = h;
            n = q > r ? r + k : r - k
        } else {
            if (r == q) {
                n = r;
                e = g > h ? h + k : h - k
            } else {
                o = (r - q) / (h - g);
                m = r - h * o;
                d = o * o + 1;
                l = 2 * (o * (m - r) - h);
                j = Math.pow(m - r, 2) + h * h - Math.pow(k, 2);
                f = Math.pow(l, 2) - 4 * d * j;
                if (f < 0) {
                    return [0, 0]
                }
                f = Math.sqrt(f);
                i = (-l + f) / (2 * d);
                if ((g - h > 0 && i - h > 0) || (g - h < 0 && i - h < 0)) {
                    e = i;
                    n = o * e + m
                } else {
                    e = (-l - f) / (2 * d);
                    n = o * e + m
                }
            }
        }
        s.lineCap = "round";
        s.moveTo(h, r);
        s.lineTo(e, n);
        return [e, n]
    }

    var a = {
        cannon: function (d, e, h, f, i) {
            var g = d.getTargetPosition();
            e.fillStyle = "#393";
            e.strokeStyle = "#000";
            e.beginPath();
            e.lineWidth = 1;
            e.arc(d.cx, d.cy, i - 5, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.lineWidth = 3;
            e.beginPath();
            e.moveTo(d.cx, d.cy);
            d.muzzle = c(e, d.cx, d.cy, g[0], g[1], i);
            e.closePath();
            e.stroke();
            e.lineWidth = 1;
            e.fillStyle = "#060";
            e.beginPath();
            e.arc(d.cx, d.cy, 7, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.fillStyle = "#cec";
            e.beginPath();
            e.arc(d.cx + 2, d.cy - 2, 3, 0, Math.PI * 2, true);
            e.closePath();
            e.fill()
        }, LMG: function (d, e, h, f, i) {
            var g = d.getTargetPosition();
            e.fillStyle = "#36f";
            e.strokeStyle = "#000";
            e.beginPath();
            e.lineWidth = 1;
            e.arc(d.cx, d.cy, 7, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.lineWidth = 2;
            e.beginPath();
            e.moveTo(d.cx, d.cy);
            d.muzzle = c(e, d.cx, d.cy, g[0], g[1], i);
            e.closePath();
            e.fill();
            e.stroke();
            e.lineWidth = 1;
            e.fillStyle = "#66c";
            e.beginPath();
            e.arc(d.cx, d.cy, 5, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.fillStyle = "#ccf";
            e.beginPath();
            e.arc(d.cx + 1, d.cy - 1, 2, 0, Math.PI * 2, true);
            e.closePath();
            e.fill()
        }, HMG: function (d, e, h, f, i) {
            var g = d.getTargetPosition();
            e.fillStyle = "#933";
            e.strokeStyle = "#000";
            e.beginPath();
            e.lineWidth = 1;
            e.arc(d.cx, d.cy, i - 2, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.lineWidth = 5;
            e.beginPath();
            e.moveTo(d.cx, d.cy);
            d.muzzle = c(e, d.cx, d.cy, g[0], g[1], i);
            e.closePath();
            e.fill();
            e.stroke();
            e.lineWidth = 1;
            e.fillStyle = "#630";
            e.beginPath();
            e.arc(d.cx, d.cy, i - 5, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.fillStyle = "#960";
            e.beginPath();
            e.arc(d.cx + 1, d.cy - 1, 8, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.fillStyle = "#fcc";
            e.beginPath();
            e.arc(d.cx + 3, d.cy - 3, 4, 0, Math.PI * 2, true);
            e.closePath();
            e.fill()
        }, wall: function (d, e, g, f, h) {
            e.lineWidth = 1;
            e.fillStyle = "#666";
            e.strokeStyle = "#000";
            e.fillRect(d.cx - h + 1, d.cy - h + 1, f - 1, f - 1);
            e.beginPath();
            e.moveTo(d.cx - h + 0.5, d.cy - h + 0.5);
            e.lineTo(d.cx - h + 0.5, d.cy + h + 0.5);
            e.lineTo(d.cx + h + 0.5, d.cy + h + 0.5);
            e.lineTo(d.cx + h + 0.5, d.cy - h + 0.5);
            e.lineTo(d.cx - h + 0.5, d.cy - h + 0.5);
            e.moveTo(d.cx - h + 0.5, d.cy + h + 0.5);
            e.lineTo(d.cx + h + 0.5, d.cy - h + 0.5);
            e.moveTo(d.cx - h + 0.5, d.cy - h + 0.5);
            e.lineTo(d.cx + h + 0.5, d.cy + h + 0.5);
            e.closePath();
            e.stroke()
        }, laser_gun: function (d, e) {
            e.fillStyle = "#f00";
            e.strokeStyle = "#000";
            e.beginPath();
            e.lineWidth = 1;
            e.moveTo(d.cx, d.cy - 10);
            e.lineTo(d.cx - 8.66, d.cy + 5);
            e.lineTo(d.cx + 8.66, d.cy + 5);
            e.lineTo(d.cx, d.cy - 10);
            e.closePath();
            e.fill();
            e.stroke();
            e.fillStyle = "#60f";
            e.beginPath();
            e.arc(d.cx, d.cy, 7, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.stroke();
            e.fillStyle = "#000";
            e.beginPath();
            e.arc(d.cx, d.cy, 3, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.fillStyle = "#666";
            e.beginPath();
            e.arc(d.cx + 1, d.cy - 1, 1, 0, Math.PI * 2, true);
            e.closePath();
            e.fill();
            e.lineWidth = 3;
            e.beginPath();
            e.moveTo(d.cx, d.cy);
            e.closePath();
            e.fill();
            e.stroke()
        }
    };
    b.renderBuilding = function (f) {
        var d = b.ctx, g = f.map, e = b.grid_size, h = b.grid_size / 2;
        (a[f.type] || a.wall)(f, d, g, e, h)
    }
});
_TD.a.push(function (a) {
    a._msg_texts = {
        _cant_build: "\u4e0d\u80fd\u5728\u8fd9\u513f\u4fee\u5efa",
        _cant_pass: "\u602a\u7269\u4e0d\u80fd\u901a\u8fc7\u8fd9\u513f",
        entrance: "\u8d77\u70b9",
        exit: "\u7ec8\u70b9",
        not_enough_money: "\u91d1\u94b1\u4e0d\u8db3\uff0c\u9700\u8981 $${0}\uff01",
        wave_info: "\u7b2c ${0} \u6ce2",
        panel_money_title: "\u91d1\u94b1: ",
        panel_score_title: "\u79ef\u5206: ",
        panel_life_title: "\u751f\u547d: ",
        panel_building_title: "\u5efa\u7b51: ",
        panel_monster_title: "\u602a\u7269: ",
        building_name_wall: "\u8def\u969c",
        building_name_cannon: "\u70ae\u53f0",
        building_name_LMG: "\u8f7b\u673a\u67aa",
        building_name_HMG: "\u91cd\u673a\u67aa",
        building_name_laser_gun: "\u6fc0\u5149\u70ae",
        building_info: "${0}: \u7b49\u7ea7 ${1}\uff0c\u653b\u51fb ${2}\uff0c\u901f\u5ea6 ${3}\uff0c\u5c04\u7a0b ${4}\uff0c\u6218\u7ee9 ${5}",
        building_info_wall: "${0}",
        building_intro_wall: "\u8def\u969c \u53ef\u4ee5\u963b\u6b62\u602a\u7269\u901a\u8fc7 ($${0})",
        building_intro_cannon: "\u70ae\u53f0 \u5c04\u7a0b\u3001\u6740\u4f24\u529b\u8f83\u4e3a\u5e73\u8861 ($${0})",
        building_intro_LMG: "\u8f7b\u673a\u67aa \u5c04\u7a0b\u8f83\u8fdc\uff0c\u6740\u4f24\u529b\u4e00\u822c ($${0})",
        building_intro_HMG: "\u91cd\u673a\u67aa \u5feb\u901f\u5c04\u51fb\uff0c\u5a01\u529b\u8f83\u5927\uff0c\u5c04\u7a0b\u4e00\u822c ($${0})",
        building_intro_laser_gun: "\u6fc0\u5149\u67aa \u4f24\u5bb3\u8f83\u5927\uff0c\u547d\u4e2d\u7387 100% ($${0})",
        click_to_build: "\u5de6\u952e\u70b9\u51fb\u5efa\u9020 ${0} ($${1})",
        upgrade: "\u5347\u7ea7 ${0} \u5230 ${1} \u7ea7\uff0c\u9700\u82b1\u8d39 $${2}\u3002",
        sell: "\u51fa\u552e ${0}\uff0c\u53ef\u83b7\u5f97 $${1}",
        upgrade_success: "\u5347\u7ea7\u6210\u529f\uff0c${0} \u5df2\u5347\u7ea7\u5230 ${1} \u7ea7\uff01\u4e0b\u6b21\u5347\u7ea7\u9700\u8981 $${2}\u3002",
        monster_info: "\u602a\u7269: \u751f\u547d ${0}\uff0c\u9632\u5fa1 ${1}\uff0c\u901f\u5ea6 ${2}\uff0c\u4f24\u5bb3 ${3}",
        button_upgrade_text: "\u5347\u7ea7",
        button_sell_text: "\u51fa\u552e",
        button_start_text: "\u5f00\u59cb",
        button_restart_text: "\u91cd\u65b0\u5f00\u59cb",
        button_pause_text: "\u6682\u505c",
        button_continue_text: "\u7ee7\u7eed",
        button_pause_desc_0: "\u6e38\u620f\u6682\u505c",
        button_pause_desc_1: "\u6e38\u620f\u7ee7\u7eed",
        blocked: "\u4e0d\u80fd\u5728\u8fd9\u513f\u4fee\u5efa\u5efa\u7b51\uff0c\u8d77\u70b9\u4e0e\u7ec8\u70b9\u4e4b\u95f4\u81f3\u5c11\u8981\u6709\u4e00\u6761\u8def\u53ef\u5230\u8fbe\uff01",
        monster_be_blocked: "\u4e0d\u80fd\u5728\u8fd9\u513f\u4fee\u5efa\u5efa\u7b51\uff0c\u6709\u602a\u7269\u88ab\u56f4\u8d77\u6765\u4e86\uff01",
        entrance_or_exit_be_blocked: "\u4e0d\u80fd\u5728\u8d77\u70b9\u6216\u7ec8\u70b9\u5904\u4fee\u5efa\u5efa\u7b51\uff01",
        _: "ERROR"
    };
    a._t = a.translate = function (c, d) {
        d = (typeof d == "object" && d.constructor == Array) ? d : [];
        var f = this._msg_texts[c] || this._msg_texts._, e, b = d.length;
        for (e = 0; e < b; e++) {
            f = f.replace("${" + e + "}", d[e])
        }
        return f
    }
});
_TD.a.push(function (a) {
    a.FindWay = function (b, g, d, f, c, e, i) {
        this.m = [];
        this.w = b;
        this.h = g;
        this.x1 = d;
        this.y1 = f;
        this.x2 = c;
        this.y2 = e;
        this.way = [];
        this.len = this.w * this.h;
        this.is_blocked = this.is_arrived = false;
        this.fPassable = typeof i == "function" ? i : function () {
            return true
        };
        this._init()
    };
    a.FindWay.prototype = {
        _init: function () {
            if (this.x1 == this.x2 && this.y1 == this.y2) {
                this.is_arrived = true;
                this.way = [[this.x1, this.y1]];
                return
            }
            for (var b = 0; b < this.len; b++) {
                this.m[b] = -2
            }
            this.x = this.x1;
            this.y = this.y1;
            this.distance = 0;
            this.current = [[this.x, this.y]];
            this.setVal(this.x, this.y, 0);
            while (this.next()) {
            }
        }, getVal: function (b, d) {
            var c = d * this.w + b;
            return c < this.len ? this.m[c] : -1
        }, setVal: function (b, e, c) {
            var d = e * this.w + b;
            if (d > this.len) {
                return false
            }
            this.m[d] = c
        }, getNeighborsOf: function (b, d) {
            var c = [];
            if (d > 0) {
                c.push([b, d - 1])
            }
            if (b < this.w - 1) {
                c.push([b + 1, d])
            }
            if (d < this.h - 1) {
                c.push([b, d + 1])
            }
            if (b > 0) {
                c.push([b - 1, d])
            }
            return c
        }, getAllNeighbors: function () {
            var e = [], d, f, g, b = this.current.length;
            for (f = 0; f < b; f++) {
                g = this.current[f];
                d = this.getNeighborsOf(g[0], g[1]);
                e = e.concat(d)
            }
            return e
        }, findWay: function () {
            var h = this.x2, g = this.y2, f, b = this.len, e, j, d, c, n, m = -1, k;
            while ((h != this.x1 || g != this.y1) && m != 0 && this.way.length < b) {
                this.way.unshift([h, g]);
                j = this.getNeighborsOf(h, g);
                e = j.length;
                k = [];
                m = -1;
                for (d = 0; d < e; d++) {
                    n = this.getVal(j[d][0], j[d][1]);
                    if (n < 0) {
                        continue
                    }
                    if (m < 0 || m > n) {
                        m = n
                    }
                }
                for (d = 0; d < e; d++) {
                    f = j[d];
                    if (m == this.getVal(f[0], f[1])) {
                        k.push(f)
                    }
                }
                c = k.length;
                d = c > 1 ? Math.floor(Math.random() * c) : 0;
                f = k[d];
                h = f[0];
                g = f[1]
            }
        }, arrive: function () {
            this.current = [];
            this.is_arrived = true;
            this.findWay()
        }, blocked: function () {
            this.current = [];
            this.is_blocked = true
        }, next: function () {
            var h = this.getAllNeighbors(), c, d = h.length, f = [], b, j, g, e;
            this.distance++;
            for (g = 0; g < d; g++) {
                c = h[g];
                b = c[0];
                j = c[1];
                if (this.getVal(b, j) != -2) {
                    continue
                }
                if (this.fPassable(b, j)) {
                    e = this.distance;
                    f.push(c)
                } else {
                    e = -1
                }
                this.setVal(b, j, e);
                if (b == this.x2 && j == this.y2) {
                    this.arrive();
                    return false
                }
            }
            if (f.length == 0) {
                this.blocked();
                return false
            }
            this.current = f;
            return true
        }
    }
});