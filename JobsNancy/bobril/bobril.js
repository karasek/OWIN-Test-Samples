/// <reference path="lib/bobril.d.ts"/>
var JobsApp;
(function (JobsApp) {
    function h(tag) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return { tag: tag, children: args };
    }
    var JobDetail = (function () {
        function JobDetail() {
        }
        return JobDetail;
    })();
    var Job = (function () {
        function Job() {
        }
        Job.render = function (ctx, me, oldMe) {
            me.tag = "li";
            me.children = ctx.data.Title + " " + ctx.data.Description;
        };
        return Job;
    })();
    var JobList = (function () {
        function JobList() {
            this.loadFromServerSync();
        }
        JobList.prototype.loadFromServerSync = function () {
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", "../jobs", false);
            xhReq.send(null);
            this.jobs = (JSON.parse(xhReq.responseText));
        };
        return JobList;
    })();
    function jobComponent(jd) {
        return { tag: "div", component: Job, data: jd };
    }
    var App = (function () {
        function App() {
        }
        App.init = function (ctx, me) {
            ctx.jobs = new JobList();
        };
        App.render = function (ctx, me, oldMe) {
            me.tag = "ul";
            me.children = [ctx.jobs.jobs.map(function (jd) { return jobComponent(jd); })];
        };
        return App;
    })();
    b.init(function () {
        b.invalidate();
        return [
            h("h1", "GMC Jobs"),
            {
                tag: "div",
                component: App
            }
        ];
    });
})(JobsApp || (JobsApp = {}));
//# sourceMappingURL=bobril.js.map