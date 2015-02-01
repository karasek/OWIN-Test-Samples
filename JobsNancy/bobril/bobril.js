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
    var ActionButton = (function () {
        function ActionButton() {
        }
        ActionButton.render = function (ctx, me) {
            me.tag = "button";
            me.className = ctx.data.className;
            me.children = ctx.data.label;
        };
        ActionButton.onClick = function (ctx, event) {
            ctx.data.perform(ctx.data.id);
            return true;
        };
        return ActionButton;
    })();
    JobsApp.ActionButton = ActionButton;
    var JobDetail = (function () {
        function JobDetail() {
        }
        return JobDetail;
    })();
    var Job = (function () {
        function Job() {
        }
        Job.render = function (ctx, me, oldMe) {
            me.tag = "tr";
            me.children = [
                h("td", ctx.data.job.Title),
                h("td", [
                    hc("button", "btn btn-info", ["Info"]),
                    hca("a", "btn btn-success", { href: "/crash" }, ["Apply"]),
                    {
                        component: ActionButton,
                        data: {
                            id: ctx.data.job.Id,
                            label: "Delete",
                            className: "btn btn-danger",
                            perform: function (id) { return ctx.data.onDelete(id); }
                        }
                    }
                ])
            ];
        };
        return Job;
    })();
    var JobList = (function () {
        function JobList() {
            this.jobs = this.loadFromServerSync();
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
        return JobList;
    })();
    function jobComponent(jobList, jd) {
        return {
            tag: "div",
            component: Job,
            data: {
                job: jd,
                onDelete: function (id) { return jobList.deleteJob(id); }
            }
        };
    }
    var App = (function () {
        function App() {
        }
        App.init = function (ctx, me) {
            ctx.jobs = new JobList();
        };
        App.render = function (ctx, me, oldMe) {
            me.tag = "div";
            me.children = [
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
        };
        return App;
    })();
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