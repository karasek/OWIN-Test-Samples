/// <reference path="lib/bobril.d.ts"/>
/// <reference path="lib/bobril.mouse.d.ts"/>
var JobsApp;
(function (JobsApp) {
    function h(tag) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return { tag: tag, children: args };
    }
    function hc(tag, clsName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return { tag: tag, className: clsName, children: args };
    }
    function hca(tag, clsName, attributes) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return { tag: tag, className: clsName, attrs: attributes, children: args };
    }
    var ActionButton = {
        render: function (ctx, me) {
            me.tag = "button";
            me.className = ctx.data.className;
            me.children = ctx.data.label;
        },
        onClick: function (ctx, event) {
            ctx.data.perform(ctx.data.id);
            return true;
        }
    };
    var JobDetail = (function () {
        function JobDetail() {
        }
        return JobDetail;
    })();
    var BootstrapModal = {
        render: function (ctx, me) {
            me.tag = 'div';
            if (ctx.data.title != undefined)
                me.className = 'modal show';
            else
                me.className = 'modal hide';
            me.children = [
                hc("div", "modal-header", h("h3", ctx.data.title)),
                hc("div", "modal-body", ctx.data.children),
                hc("div", "modal-footer", "Click anywhere to close")
            ];
        },
        onClick: function (ctx) {
            ctx.data.onClose();
            return true;
        }
    };
    function jobDetailModal(jd, onCloseFce) {
        return {
            tag: "div",
            data: {
                onClose: onCloseFce,
                confirm: "OK",
                title: jd.Title,
                children: [
                    hc("p", "descr", jd.Description),
                    h("h5", jd.Requirements),
                    h("ul", (jd.Required) ? jd.Required.map(function (req) { return h("li", req); }) : ''),
                    h("p", "Language:", jd.Language)
                ]
            },
            component: BootstrapModal
        };
    }
    var JobComponent = {
        render: function (ctx, me) {
            me.tag = "tr";
            me.children = [
                h("td", ctx.data.job.Title),
                h("td", {
                    component: ActionButton,
                    data: {
                        id: ctx.data.job.Id,
                        label: "Info",
                        className: "btn btn-info",
                        perform: function (id) { return ctx.data.onInfo(id); }
                    }
                }, hca("a", "btn btn-success", { href: "/crash" }, "Apply"), {
                    component: ActionButton,
                    data: {
                        id: ctx.data.job.Id,
                        label: "Delete",
                        className: "btn btn-danger",
                        perform: function (id) { return ctx.data.onDelete(id); }
                    }
                })
            ];
        }
    };
    var JobList = (function () {
        function JobList() {
            this.jobs = this.loadFromServerSync();
            this.showModalId = -1;
        }
        JobList.prototype.loadFromServerSync = function () {
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", "../jobs", false);
            xhReq.send(null);
            return (JSON.parse(xhReq.responseText));
        };
        JobList.prototype.deleteJob = function (id) {
            var xhReq = new XMLHttpRequest();
            xhReq.open("DELETE", "../jobs/" + id, false);
            xhReq.send(null);
            for (var i = 0; i < this.jobs.length; i++) {
                if (this.jobs[i].Id == id) {
                    this.jobs.splice(i, 1);
                    break;
                }
            }
        };
        JobList.prototype.showInfo = function (id) {
            this.showModalId = id;
            //document.getElementById('infoModal')
        };
        JobList.prototype.closeInfo = function () {
            this.showModalId = -1;
        };
        JobList.prototype.getSelected = function () {
            for (var i = 0; i < this.jobs.length; i++)
                if (this.jobs[i].Id == this.showModalId)
                    return this.jobs[i];
            return new JobDetail();
        };
        return JobList;
    })();
    function jobComponent(jobList, jd) {
        return {
            tag: "div",
            component: JobComponent,
            data: {
                job: jd,
                onDelete: function (id) { return jobList.deleteJob(id); },
                onInfo: function (id) { return jobList.showInfo(id); }
            }
        };
    }
    var App = {
        init: function (ctx, me) {
            ctx.jobs = new JobList();
        },
        render: function (ctx, me) {
            me.tag = "div";
            me.children = [
                jobDetailModal(ctx.jobs.getSelected(), function () { return ctx.jobs.closeInfo(); }),
                {
                    tag: "table",
                    className: "table table-hover",
                    children: [
                        h("tr", [
                            h("th", "Title"),
                            h("th", "Action")
                        ]),
                        ctx.jobs.jobs.map(function (jd) { return jobComponent(ctx.jobs, jd); })
                    ]
                }
            ];
        }
    };
    b.init(function () {
        b.invalidate();
        return [
            h("h3", "GMC Software open positions"),
            {
                tag: "div",
                component: App
            }
        ];
    });
})(JobsApp || (JobsApp = {}));
//# sourceMappingURL=bobril.js.map