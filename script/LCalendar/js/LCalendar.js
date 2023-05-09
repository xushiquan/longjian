window.LCalendar = function() {
	var e = function() {
		this.gearDate
		//最小年
		this.minY = 1900;
		//最小月
		this.minM = 1;
		//最小日
		this.minD = 1;
		//最大年
		this.maxY = 2099;
		//最大月
		this.maxM = 12;
		//最大日
		this.maxD = 31;
	};
	return e.prototype = {
		init : function(e) {
			if (this.type = e.type, this.trigger = document.querySelector(e.trigger), null != this.trigger.getAttribute("data-lcalendar")) {
				var t = this.trigger.getAttribute("data-lcalendar").split(","), a = t[0].split("-");
				this.minY = ~~a[0], this.minM = ~~a[1], this.minD = ~~a[2];
				var r = t[1].split("-");
				this.maxY = ~~r[0], this.maxM = ~~r[1], this.maxD = ~~r[2]
			}
			if (e.minDate) {
				var a = e.minDate.split("-");
				this.minY = ~~a[0], this.minM = ~~a[1], this.minD = ~~a[2]
			}
			if (e.maxDate) {
				var r = e.maxDate.split("-");
				this.maxY = ~~r[0], this.maxM = ~~r[1], this.maxD = ~~r[2]
			}
			this.bindEvent(this.type)
		},
		bindEvent : function(e) {
			function t(e) {
				E.gearDate = document.createElement("div"), E.gearDate.className = "gearDate", E.gearDate.innerHTML = '<div class="date_ctrl slideInUp"><div class="date_btn_box"><div class="date_btn lcalendar_cancel">取消</div><div class="date_btn lcalendar_finish">确定</div></div><div class="date_roll_mask" style="background-color: #F0F8FF;"><div class="date_roll"><div><div class="gear date_yy" data-datetype="date_yy"></div><div class="date_grid"><div>年</div></div></div><div><div class="gear date_mm" data-datetype="date_mm"></div><div class="date_grid"><div>月</div></div></div><div><div class="gear date_dd" data-datetype="date_dd"></div><div class="date_grid"><div>日</div></div></div></div></div></div>', document.body.appendChild(E.gearDate), a();
				var t = E.gearDate.querySelector(".lcalendar_cancel");
				t.addEventListener("touchstart", y);
				var r = E.gearDate.querySelector(".lcalendar_finish");
				r.addEventListener("touchstart", p);
				var i = E.gearDate.querySelector(".date_yy"), d = E.gearDate.querySelector(".date_mm"), n = E.gearDate.querySelector(".date_dd");
				i.addEventListener("touchstart", m), d.addEventListener("touchstart", m), n.addEventListener("touchstart", m), i.addEventListener("touchmove", u), d.addEventListener("touchmove", u), n.addEventListener("touchmove", u), i.addEventListener("touchend", g), d.addEventListener("touchend", g), n.addEventListener("touchend", g)
			}

			function a() {
				var e = new Date, t = {
					yy : e.getFullYear(),
					mm : e.getMonth(),
					dd : e.getDate() - 1
				};
				/^\d{4}-\d{1,2}-\d{1,2}$/.test(E.trigger.value) ? ( rs = E.trigger.value.match(/(^|-)\d{1,4}/g), t.yy = rs[0] - E.minY, t.mm = rs[1].replace(/-/g, "") - 1, t.dd = rs[2].replace(/-/g, "") - 1) : t.yy = t.yy - E.minY, E.gearDate.querySelector(".date_yy").setAttribute("val", t.yy), E.gearDate.querySelector(".date_mm").setAttribute("val", t.mm), E.gearDate.querySelector(".date_dd").setAttribute("val", t.dd), l()
			}

			function r(e) {
				E.gearDate = document.createElement("div"), E.gearDate.className = "gearDate", E.gearDate.innerHTML = '<div class="date_ctrl slideInUp"><div class="date_btn_box"><div class="date_btn lcalendar_cancel">取消</div><div class="date_btn lcalendar_finish">确定</div></div><div class="date_roll_mask" style="background-color: #F0F8FF;"><div class="ym_roll"><div><div class="gear date_yy" data-datetype="date_yy"></div><div class="date_grid"><div>年</div></div></div><div><div class="gear date_mm" data-datetype="date_mm"></div><div class="date_grid"><div>月</div></div></div></div></div></div>', document.body.appendChild(E.gearDate), i();
				var t = E.gearDate.querySelector(".lcalendar_cancel");
				t.addEventListener("touchstart", y);
				var a = E.gearDate.querySelector(".lcalendar_finish");
				a.addEventListener("touchstart", D);
				var r = E.gearDate.querySelector(".date_yy"), d = E.gearDate.querySelector(".date_mm");
				r.addEventListener("touchstart", m), d.addEventListener("touchstart", m), r.addEventListener("touchmove", u), d.addEventListener("touchmove", u), r.addEventListener("touchend", g), d.addEventListener("touchend", g)
			}

			function i() {
				var e = new Date, t = {
					yy : e.getFullYear(),
					mm : e.getMonth()
				};
				/^\d{4}-\d{1,2}$/.test(E.trigger.value) ? ( rs = E.trigger.value.match(/(^|-)\d{1,4}/g), t.yy = rs[0] - E.minY, t.mm = rs[1].replace(/-/g, "") - 1) : t.yy = t.yy - E.minY, E.gearDate.querySelector(".date_yy").setAttribute("val", t.yy), E.gearDate.querySelector(".date_mm").setAttribute("val", t.mm), l()
			}

			function d(e) {
				E.gearDate = document.createElement("div"), E.gearDate.className = "gearDatetime", E.gearDate.innerHTML = '<div class="date_ctrl slideInUp"><div class="date_btn_box"><div class="date_btn lcalendar_cancel">取消</div><div class="date_btn lcalendar_finish">确定</div></div><div class="date_roll_mask" style="background-color: #F0F8FF;"><div class="datetime_roll"><div><div class="gear date_yy" data-datetype="date_yy"></div><div class="date_grid"><div>年</div></div></div><div><div class="gear date_mm" data-datetype="date_mm"></div><div class="date_grid"><div>月</div></div></div><div><div class="gear date_dd" data-datetype="date_dd"></div><div class="date_grid"><div>日</div></div></div><div><div class="gear time_hh" data-datetype="time_hh"></div><div class="date_grid"><div>时</div></div></div><div><div class="gear time_mm" data-datetype="time_mm"></div><div class="date_grid"><div>分</div></div></div></div></div></div>', document.body.appendChild(E.gearDate), n();
				var t = E.gearDate.querySelector(".lcalendar_cancel");
				t.addEventListener("touchstart", y);
				var a = E.gearDate.querySelector(".lcalendar_finish");
				a.addEventListener("touchstart", b);
				var r = E.gearDate.querySelector(".date_yy"), i = E.gearDate.querySelector(".date_mm"), d = E.gearDate.querySelector(".date_dd"), s = E.gearDate.querySelector(".time_hh"), v = E.gearDate.querySelector(".time_mm");
				r.addEventListener("touchstart", m), i.addEventListener("touchstart", m), d.addEventListener("touchstart", m), s.addEventListener("touchstart", m), v.addEventListener("touchstart", m), r.addEventListener("touchmove", u), i.addEventListener("touchmove", u), d.addEventListener("touchmove", u), s.addEventListener("touchmove", u), v.addEventListener("touchmove", u), r.addEventListener("touchend", g), i.addEventListener("touchend", g), d.addEventListener("touchend", g), s.addEventListener("touchend", g), v.addEventListener("touchend", g)
			}

			function n() {
				var e = new Date, t = {
					yy : e.getFullYear(),
					mm : e.getMonth(),
					dd : e.getDate() - 1,
					hh : e.getHours(),
					mi : e.getMinutes()
				};
				/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(E.trigger.value) ? ( rs = E.trigger.value.match(/(^|-|\s|:)\d{1,4}/g), t.yy = rs[0] - E.minY, t.mm = rs[1].replace(/-/g, "") - 1, t.dd = rs[2].replace(/-/g, "") - 1, t.hh = parseInt(rs[3].replace(/\s0?/g, "")), t.mi = parseInt(rs[4].replace(/:0?/g, ""))) : t.yy = t.yy - E.minY, E.gearDate.querySelector(".date_yy").setAttribute("val", t.yy), E.gearDate.querySelector(".date_mm").setAttribute("val", t.mm), E.gearDate.querySelector(".date_dd").setAttribute("val", t.dd), l(), E.gearDate.querySelector(".time_hh").setAttribute("val", t.hh), E.gearDate.querySelector(".time_mm").setAttribute("val", t.mi), c()
			}

			function s(e) {
				E.gearDate = document.createElement("div"), E.gearDate.className = "gearDate", E.gearDate.innerHTML = '<div class="date_ctrl slideInUp"><div class="date_btn_box"><div class="date_btn lcalendar_cancel">取消</div><div class="date_btn lcalendar_finish">确定</div></div><div class="date_roll_mask" style="background-color: #F0F8FF;"><div class="time_roll"><div><div class="gear time_hh" data-datetype="time_hh"></div><div class="date_grid"><div>时</div></div></div><div><div class="gear time_mm" data-datetype="time_mm"></div><div class="date_grid"><div>分</div></div></div></div></div></div>', document.body.appendChild(E.gearDate), v();
				var t = E.gearDate.querySelector(".lcalendar_cancel");
				t.addEventListener("touchstart", y);
				var a = E.gearDate.querySelector(".lcalendar_finish");
				a.addEventListener("touchstart", f);
				var r = E.gearDate.querySelector(".time_hh"), i = E.gearDate.querySelector(".time_mm");
				r.addEventListener("touchstart", m), i.addEventListener("touchstart", m), r.addEventListener("touchmove", u), i.addEventListener("touchmove", u), r.addEventListener("touchend", g), i.addEventListener("touchend", g)
			}

			function v() {
				var e = new Date, t = {
					hh : e.getHours(),
					mm : e.getMinutes()
				};
				/^\d{2}:\d{2}$/.test(E.trigger.value) && ( rs = E.trigger.value.match(/(^|:)\d{2}/g), t.hh = parseInt(rs[0].replace(/^0?/g, "")), t.mm = parseInt(rs[1].replace(/:0?/g, ""))), E.gearDate.querySelector(".time_hh").setAttribute("val", t.hh), E.gearDate.querySelector(".time_mm").setAttribute("val", t.mm), c()
			}

			function l() {
				var e = (new Date).getFullYear(), t = E.maxY - E.minY + 1, a = E.gearDate.querySelector(".date_yy"), r = "";
				if (a && a.getAttribute("val")) {
					for (var i = parseInt(a.getAttribute("val")), d = 0; d <= t - 1; d++)
						r += "<div class='tooth'>" + (E.minY + d) + "</div>";
					a.innerHTML = r;
					var n = Math.floor(parseFloat(a.getAttribute("top")));
					if (isNaN(n)) {
						var s = 8 - 2 * (t - 1), v = Math.abs(s - 8) / 2;
						E.maxY < e ? i > v && ( i = v) : E.minY > e && i < v && ( i = v), a.style["-webkit-transform"] = "translate3d(0," + (8 - 2 * i) + "em,0)", a.setAttribute("top", 8 - 2 * i + "em")
					} else {
						n % 2 == 0 ? n = n : n += 1, n > 8 && ( n = 8);
						var s = 8 - 2 * (t - 1);
						n < s && ( n = s), a.style["-webkit-transform"] = "translate3d(0," + n + "em,0)", a.setAttribute("top", n + "em"), i = Math.abs(n - 8) / 2, a.setAttribute("val", i)
					}
					var l = E.gearDate.querySelector(".date_mm");
					if (l && l.getAttribute("val")) {
						r = "";
						var c = parseInt(l.getAttribute("val")), m = 11, u = 0;
						i == t - 1 && ( m = E.maxM - 1), 0 == i && ( u = E.minM - 1);
						for (var d = 0; d < m - u + 1; d++)
							r += "<div class='tooth'>" + (u + d + 1) + "</div>";
						l.innerHTML = r;
						var n = Math.floor(parseFloat(l.getAttribute("top")));
						isNaN(n) ? c > m || E.maxY < e && !E.trigger.value ? c = m : (c < u || E.minY > e && !E.trigger.value) && ( c = m) : c > m ? c = m : c < u && ( c = m), l.setAttribute("val", c), l.style["-webkit-transform"] = "translate3d(0," + (8 - 2 * (c - u)) + "em,0)", l.setAttribute("top", 8 - 2 * (c - u) + "em");
						var g = E.gearDate.querySelector(".date_dd");
						if (g && g.getAttribute("val")) {
							r = "";
							var _ = parseInt(g.getAttribute("val")), h = o(i, c), y = h - 1, p = 0;
							i == t - 1 && E.maxM == c + 1 && ( y = E.maxD - 1), 0 == i && E.minM == c + 1 && ( p = E.minD - 1);
							for (var d = 0; d < y - p + 1; d++)
								r += "<div class='tooth'>" + (p + d + 1) + "</div>";
							g.innerHTML = r;
							var n = Math.floor(parseFloat(g.getAttribute("top")));
							isNaN(n) ? _ > y || E.maxY < e && !E.trigger.value ? _ = y : (_ < p || E.minY > e && !E.trigger.value) && ( _ = y) : _ > y ? _ = y : _ < p && ( _ = p), g.setAttribute("val", _), g.style["-webkit-transform"] = "translate3d(0," + (8 - 2 * (_ - p)) + "em,0)", g.setAttribute("top", 8 - 2 * (_ - p) + "em")
						}
					}
				}
			}

			function c() {
				var e = E.gearDate.querySelector(".time_hh");
				if (e && e.getAttribute("val")) {
					for (var t = "", a = parseInt(e.getAttribute("val")), r = 0; r <= 23; r++)
						t += "<div class='tooth'>" + r + "</div>";
					e.innerHTML = t, e.style["-webkit-transform"] = "translate3d(0," + (8 - 2 * a) + "em,0)", e.setAttribute("top", 8 - 2 * a + "em");
					var i = E.gearDate.querySelector(".time_mm");
					if (i && i.getAttribute("val")) {
						for (var t = "", d = parseInt(i.getAttribute("val")), r = 0; r <= 59; r++)
							t += "<div class='tooth'>" + r + "</div>";
						i.innerHTML = t, i.style["-webkit-transform"] = "translate3d(0," + (8 - 2 * d) + "em,0)", i.setAttribute("top", 8 - 2 * d + "em")
					}
				}
			}

			function o(e, t) {
				return 1 == t ? (e += E.minY, e % 4 == 0 && e % 100 != 0 || e % 400 == 0 && e % 4e3 != 0 ? 29 : 28) : 3 == t || 5 == t || 8 == t || 10 == t ? 30 : 31
			}

			function m(e) {
				e.preventDefault();
				for (var t = e.target; ; ) {
					if (t.classList.contains("gear"))
						break;
					t = t.parentElement
				}
				clearInterval(t["int_" + t.id]), t["old_" + t.id] = e.targetTouches[0].screenY, t["o_t_" + t.id] = (new Date).getTime();
				var a = t.getAttribute("top");
				a ? t["o_d_" + t.id] = parseFloat(a.replace(/em/g, "")) : t["o_d_" + t.id] = 0, t.style.webkitTransitionDuration = t.style.transitionDuration = "0ms"
			}

			function u(e) {
				e.preventDefault();
				for (var t = e.target; ; ) {
					if (t.classList.contains("gear"))
						break;
					t = t.parentElement
				}
				t["new_" + t.id] = e.targetTouches[0].screenY, t["n_t_" + t.id] = (new Date).getTime();
				var a = 30 * (t["new_" + t.id] - t["old_" + t.id]) / window.innerHeight;
				t["pos_" + t.id] = t["o_d_" + t.id] + a, t.style["-webkit-transform"] = "translate3d(0," + t["pos_" + t.id] + "em,0)", t.setAttribute("top", t["pos_" + t.id] + "em"), e.targetTouches[0].screenY < 1 && g(e)
			}

			function g(e) {
				e.preventDefault();
				for (var t = e.target; ; ) {
					if (t.classList.contains("gear"))
						break;
					t = t.parentElement
				}
				var a = (t["new_" + t.id] - t["old_" + t.id]) / (t["n_t_" + t.id] - t["o_t_" + t.id]);
				Math.abs(a) <= .2 ? t["spd_" + t.id] = a < 0 ? -.08 : .08 : Math.abs(a) <= .5 ? t["spd_" + t.id] = a < 0 ? -.16 : .16 : t["spd_" + t.id] = a / 2, t["pos_" + t.id] || (t["pos_" + t.id] = 0), _(t)
			}

			function _(e) {
				function t() {
					e.style.webkitTransitionDuration = e.style.transitionDuration = "200ms", r = !0
				}

				var a = 0, r = !1, i = E.maxY - E.minY + 1;
				clearInterval(e["int_" + e.id]), e["int_" + e.id] = setInterval(function() {
					if (!E.gearDate)
						return
						void        clearInterval(e["int_" + e.id]);
					var d = e["pos_" + e.id], n = e["spd_" + e.id] * Math.exp(-.03 * a);
					if (d += n, Math.abs(n) > .1)
						;
					else {
						var s = 2 * Math.round(d / 2);
						d = s, t()
					}
					switch(d>8&&(d=8,t()),e.dataset.datetype) {
						case"date_yy":
							var v = 8 - 2 * (i - 1);
							if (d < v && ( d = v, t()), r) {
								var l = Math.abs(d - 8) / 2;
								h(e, l), clearInterval(e["int_" + e.id])
							}
							break;
						case"date_mm":
							var c = E.gearDate.querySelector(".date_yy"), m = parseInt(c.getAttribute("val")), u = 11, g = 0;
							m == i - 1 && ( u = E.maxM - 1), 0 == m && ( g = E.minM - 1);
							var v = 8 - 2 * (u - g);
							if (d < v && ( d = v, t()), r) {
								var l = Math.abs(d - 8) / 2 + g;
								h(e, l), clearInterval(e["int_" + e.id])
							}
							break;
						case"date_dd":
							var c = E.gearDate.querySelector(".date_yy"), _ = E.gearDate.querySelector(".date_mm"), m = parseInt(c.getAttribute("val")), y = parseInt(_.getAttribute("val")), p = o(m, y), D = p - 1, b = 0;
							m == i - 1 && E.maxM == y + 1 && ( D = E.maxD - 1), 0 == m && E.minM == y + 1 && ( b = E.minD - 1);
							var v = 8 - 2 * (D - b);
							if (d < v && ( d = v, t()), r) {
								var l = Math.abs(d - 8) / 2 + b;
								h(e, l), clearInterval(e["int_" + e.id])
							}
							break;
						case"time_hh":
							if (d < -38 && ( d = -38, t()), r) {
								var l = Math.abs(d - 8) / 2;
								h(e, l), clearInterval(e["int_" + e.id])
							}
							break;
						case"time_mm":
							if (d < -110 && ( d = -110, t()), r) {
								var l = Math.abs(d - 8) / 2;
								h(e, l), clearInterval(e["int_" + e.id])
							}
					}
					e["pos_" + e.id] = d, e.style["-webkit-transform"] = "translate3d(0," + d + "em,0)", e.setAttribute("top", d + "em"), a++
				}, 30)
			}

			function h(e, t) {
				null === E.gearDate || isNaN(t) || ( t = Math.round(t), e.setAttribute("val", t), /date/.test(e.dataset.datetype) ? l() : c())
			}

			function y(e) {
				e.preventDefault();
				var t;
				try {
					t = new CustomEvent("input")
				} catch(e) {
					t = document.createEvent("Event"), t.initEvent("input", !0, !0)
				}
				E.trigger.dispatchEvent(t), document.body.removeChild(E.gearDate), E.gearDate = null
			}

			function p(e) {
				var t = E.maxY - E.minY + 1, a = parseInt(Math.round(E.gearDate.querySelector(".date_yy").getAttribute("val"))), r = parseInt(Math.round(E.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
				r = r > 9 ? r : "0" + r;
				var i = parseInt(Math.round(E.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				i = i > 9 ? i : "0" + i, E.trigger.value = a % t + E.minY + "-" + r + "-" + i, y(e)
			}

			function D(e) {
				var t = E.maxY - E.minY + 1, a = parseInt(Math.round(E.gearDate.querySelector(".date_yy").getAttribute("val"))), r = parseInt(Math.round(E.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
				r = r > 9 ? r : "0" + r, E.trigger.value = a % t + E.minY + "-" + r, y(e)
			}

			function b(e) {
				var t = E.maxY - E.minY + 1, a = parseInt(Math.round(E.gearDate.querySelector(".date_yy").getAttribute("val"))), r = parseInt(Math.round(E.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
				r = r > 9 ? r : "0" + r;
				var i = parseInt(Math.round(E.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				i = i > 9 ? i : "0" + i;
				var d = parseInt(Math.round(E.gearDate.querySelector(".time_hh").getAttribute("val")));
				d = d > 9 ? d : "0" + d;
				var n = parseInt(Math.round(E.gearDate.querySelector(".time_mm").getAttribute("val")));
				n = n > 9 ? n : "0" + n, E.trigger.value = a % t + E.minY + "-" + r + "-" + i + " " + (d.length < 2 ? "0" : "") + d + (n.length < 2 ? ":0" : ":") + n, y(e)
			}

			function f(e) {
				var t = parseInt(Math.round(E.gearDate.querySelector(".time_hh").getAttribute("val")));
				t = t > 9 ? t : "0" + t;
				var a = parseInt(Math.round(E.gearDate.querySelector(".time_mm").getAttribute("val")));
				a = a > 9 ? a : "0" + a, E.trigger.value = (t.length < 2 ? "0" : "") + t + (a.length < 2 ? ":0" : ":") + a, y(e)
			}

			var E = this;
			E.trigger.addEventListener("click", {ym:r,date:t,datetime:d,time:s}[e])
		}
	}, e
}();
