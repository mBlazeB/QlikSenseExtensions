define("extensions/Calendvariable/util", [
        'jquery',
        'qlik',
         'text!./lib/datepicker.css',
        './lib/jquery-1.12.4',
        './lib/jquery-ui'
       
 ], function ($, e,datepickerCss) {
     "use strict";
     $("<style>").html(datepickerCss).appendTo("head");
    function t(e, t, l) {
        var a = document.createElement(e);
        return t && (a.className = t), void 0 !== l && (a.innerHTML = l), a
    }

    function l(e, t) {
        0 === e.childNodes.length ? e.appendChild(t) : e.replaceChild(t, e.childNodes[0])
    }

    function a(e) {
        var l = t("link");
        l.rel = "stylesheet", l.type = "text/css", l.href = require.toUrl(e), document.head.appendChild(l)
    }

    function i(t) {
        var l = e.currApp();
        l.variable.getByName ? l.variable.getByName(t).then(function () { }, function () {
            l.variable.create(t)
        }) : l.variable.create(t)
    }
   
    return {
        createElement: t,
        setChild: l,
        addStyleSheet: a,
        createVariable: i
    }
   
}), define("extensions/Calendvariable/properties", ["./util"],
    function (e) {
    "use strict";
    return {
        initialProperties: {
            variableValue: {},
            variableName: "",
            render: "f",
            alternatives: [],
            min: 0,
            max: 100,
            step: 1,
            style: "qlik",
            width: "",
            customwidth: ""
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        variable: {
                            type: "items",
                            label: "Calendvariable",
                            items: {
                                name: {
                                    ref: "variableName",
                                    label: "Name",
                                    type: "string",
                                    change: function (t) {
                                        e.createVariable(t.variableName), t.variableValue = t.variableValue || {}, t.variableValue.qStringExpression = "=" + t.variableName
                                    }
                                },
                                style: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Style",
                                    ref: "style",
                                    options: [{
                                        value: "qlik",
                                        label: "Qlik"
                                    }, {
                                        value: "bootstrap",
                                        label: "Bootstrap"
                                    }, {
                                        value: "material",
                                        label: "Material"
                                    }]
                                },
                                width: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Width",
                                    ref: "width",
                                    options: [{
                                        value: "",
                                        label: "Default"
                                    }, {
                                        value: "fill",
                                        label: "Fill"
                                    }, {
                                        value: "custom",
                                        label: "Custom"
                                    }]
                                },
                                customwidth: {
                                    type: "string",
                                    ref: "customwidth",
                                    label: "Custom width",
                                    expression: "optional",
                                    show: function (e) {
                                        return "custom" === e.width
                                    }
                                },
                                render: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Render as",
                                    ref: "render",
                                    options: [{
                                        value: "b",
                                        label: "Button"
                                    }, {
                                        value: "s",
                                        label: "Select"
                                    }, {
                                        value: "f",
                                        label: "Field"
                                    }, {
                                        value: "l",
                                        label: "Slider"
                                    }],
                                    defaultValue: "f"
                                },
                                alternatives: {
                                    type: "array",
                                    ref: "alternatives",
                                    label: "Alternatives",
                                    itemTitleRef: "label",
                                    allowAdd: !0,
                                    allowRemove: !0,
                                    addTranslation: "Add Alternative",
                                    items: {
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Value",
                                            expression: "optional"
                                        },
                                        label: {
                                            type: "string",
                                            ref: "label",
                                            label: "Label",
                                            expression: "optional"
                                        }
                                    },
                                    show: function (e) {
                                        return "b" === e.render || "s" === e.render
                                    }
                                },
                                min: {
                                    ref: "min",
                                    label: "Min",
                                    type: "number",
                                    defaultValue: 0,
                                    expression: "optional",
                                    show: function (e) {
                                        return "l" === e.render
                                    }
                                },
                                max: {
                                    ref: "max",
                                    label: "Max",
                                    type: "number",
                                    defaultValue: 100,
                                    expression: "optional",
                                    show: function (e) {
                                        return "l" === e.render
                                    }
                                },
                                step: {
                                    ref: "step",
                                    label: "Step",
                                    type: "number",
                                    defaultValue: 1,
                                    expression: "optional",
                                    show: function (e) {
                                        return "l" === e.render
                                    }
                                },
                                rangelabel: {
                                    ref: "rangelabel",
                                    label: "Slider label",
                                    type: "boolean",
                                    defaultValue: !1,
                                    show: function (e) {
                                        return "l" === e.render
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    }), 
    define([
        'jquery',
        'qlik',
        './util',
        './properties',
        'extensions/Calendvariable/util'
    ],

        
     function ($, e,t,l)  {
         "use strict";
         function a(e) {
        return 100 * (e.value - e.min) / (e.max - e.min)
    }
        
         function i($, e,t,l)  {
        switch (e) {
            case "material":
            case "bootstrap":
                if (l) return "selected";
                break;
            default:
                switch (t) {
                    case "button":
                        return l ? "qui-button-selected lui-button lui-button--success" : "qui-button lui-button";
                    case "select":
                        return "qui-select lui-select";
                    case "input":
                        return "qui-input lui-input"
                }
        }
    }

    function n(e) {
        return "l" === e.render ? "98%" : "custom" === e.width ? e.customwidth : "fill" === e.width ? "b" !== e.render ? "100%" : "calc( " + 100 / e.alternatives.length + "% - 3px)" : void 0
    }
    return t.addStyleSheet("extensions/Calendvariable/lib/variable.css"), {
        initialProperties: l.initialProperties,
        definition: l.definition,
        paint: function (l, r) {
            var s = t.createElement("div", r.style || "qlik"),
                u = n(r);
            if ("b" === r.render) r.alternatives.forEach(function (l) {
                var a = t.createElement("button", i(r.style, "button", l.value === r.variableValue), l.label);
                a.onclick = function () {
                    e.currApp().variable.setContent(r.variableName, l.value)
                }, a.style.width = u, s.appendChild(a)
            });
            else if ("s" === r.render) {
                var o = t.createElement("select", i(r.style, "select"));
                o.style.width = u, r.alternatives.forEach(function (e) {
                    var l = t.createElement("option", void 0, e.label);
                    l.value = e.value, l.selected = e.value === r.variableValue, o.appendChild(l)
                }), o.onchange = function () {
                    e.currApp().variable.setContent(r.variableName, this.value)
                }, s.appendChild(o)
            } else if ("l" === r.render) {
                var d = t.createElement("input");
                if (d.style.width = u, d.type = "range", d.min = r.min || 0, d.max = r.max || 100, d.step = r.step || 1, d.value = r.variableValue, d.onchange = function () {
                        this.label ? (this.label.style.left = a(this) + "%", this.label.textContent = this.value) : this.title = this.value, e.currApp().variable.setContent(r.variableName, this.value)
                }, d.oninput = function () {
                        this.label ? (this.label.style.left = a(this) + "%", this.label.textContent = this.value) : this.title = this.value
                }, s.appendChild(d), r.rangelabel) {
                    var c = t.createElement("div", "labelwrap");
                    d.label = t.createElement("div", "rangelabel", r.variableValue), d.label.style.left = a(d) + "%", c.appendChild(d.label), s.appendChild(c)
                } else d.title = r.variableValue
            } else {
                var b = t.createElement("input", i(r.style, "input"));
                var vDatePiker = Math.floor(Math.random() * 10001) + '_ext';
                b.id = vDatePiker, b.style.width = u, b.type = "text", b.value = r.variableValue, b.onchange = function () {
                    e.currApp().variable.setContent(r.variableName, this.value)
                }, b.onclick = $(b).ready(function () {
                    $('#'+vDatePiker).datepicker({ dateFormat: "dd.mm.yy" })
                    $.datepicker.regional['ru'] = {
                        closeText: "Закрыть",
                        prevText: "&#x3C;Пред",
                        nextText: "След&#x3E;",
                        currentText: "Сегодня",
                        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                        "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                        dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
                        dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
                        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                        weekHeader: "Нед",
                        dateFormat: "dd.mm.yy",
                        firstDay: 1,
                        isRTL: false,
                        showMonthAfterYear: false,
                        yearSuffix: ""
                    };
                    $.datepicker.setDefaults($.datepicker.regional['ru']);
                    }
                    
                                  )

                     , s.appendChild(b)
            } 
            t.setChild(l[0], s)
        }
    }
});