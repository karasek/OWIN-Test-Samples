/// <reference path="lib/bobril.d.ts"/>
/// <reference path="lib/bobril.mouse.d.ts"/>

module JobsApp {
    function h(tag: string, ...args: any[]) {
        return { tag: tag, children: args };
    }

    function hc(tag: string, clsName: string, ...args: any[]) {
        return { tag: tag, className: clsName, children: args };
    }

    function hca(tag: string, clsName: string, attributes: any, ...args: any[]) {
        return { tag: tag, className: clsName, attrs: attributes, children: args };
    }


    interface IButtonData {
        id: number;
        label: string;
        className: string;
        perform: (id: number) => void;
    }

    interface IButtonCtx {
        data: IButtonData;
    }

    var ActionButton: IBobrilComponent = {
        render(ctx: IButtonCtx, me: IBobrilNode): void {
            me.tag = "button";
            me.className = ctx.data.className;
            me.children = ctx.data.label;
        },

        onClick(ctx: IButtonCtx, event: IMouseEvent) {
            ctx.data.perform(ctx.data.id);
            return true;
        }
    }

    class JobDetail {
        Id: number;
        Title: string;
        Description: string;
        Requirements: string;
        Required: Array<string>;
        Language: string;
    }

    var BootstrapModal: IBobrilComponent = {
        render(ctx: any, me: IBobrilNode) {
            me.tag = 'div';
            if (ctx.data.title != undefined)
                me.className = 'modal show';
            else
                me.className = 'modal hide';
            me.children = [
                hc("div", "modal-header",
                    h("h3", ctx.data.title)),
                hc("div", "modal-body", ctx.data.children),
                hc("div", "modal-footer", "Click anywhere to close")
            ];
        },
        onClick(ctx: any){
            ctx.data.onClose();
            return true;
        }
    }

    function jobDetailModal(jd: JobDetail, onCloseFce: () => void): IBobrilComponent {
        return {
            tag: "div",
            data: {
                onClose: onCloseFce,
                confirm: "OK",
                title: jd.Title,
                children: [
                    hc("p", "descr", jd.Description),
                    h("h5", jd.Requirements),
                    h("ul",(jd.Required)
                        ? jd.Required.map((req: string) => h("li", req))
                        : ''),
                    h("p", "Language:", jd.Language)
                ]
            },
            component: BootstrapModal
        };
    }

    interface IJobData {
        job: JobDetail;
        onDelete: (id: number) => void;
        onInfo: (id: number) => void;
    }

    interface IJobCtx {
        data: IJobData;
    }

    var JobComponent: IBobrilComponent = {
        render(ctx: IJobCtx, me: IBobrilNode): void {
            me.tag = "tr";
            me.children = [
                h("td", ctx.data.job.Title),
                h("td",
                    {
                        component: ActionButton,
                        data: {
                            id: ctx.data.job.Id,
                            label: "Info",
                            className: "btn btn-info",
                            perform: (id: number) => ctx.data.onInfo(id)
                        }
                    },
                    hca("a", "btn btn-success", { href: "/crash" }, "Apply"),
                    {
                        component: ActionButton,
                        data: {
                            id: ctx.data.job.Id,
                            label: "Delete",
                            className: "btn btn-danger",
                            perform: (id: number) => ctx.data.onDelete(id)
                        }
                    }
                    )
            ];
        }
    }

    class JobList {
        constructor() {
            this.jobs = this.loadFromServerSync();
            this.showModalId = -1;
        }

        loadFromServerSync(): Array<JobDetail> {
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", "../jobs", false);
            xhReq.send(null);
            return <Array<JobDetail>>(JSON.parse(xhReq.responseText));
        }

        deleteJob(id: number) {
            var xhReq = new XMLHttpRequest();
            xhReq.open("DELETE", "../jobs/" + id, false);
            xhReq.send(null);
            for (var i = 0; i < this.jobs.length; i++) {
                if (this.jobs[i].Id == id) {
                    this.jobs.splice(i, 1);
                    break;
                }
            }
        }

        showInfo(id: number) {
            this.showModalId = id;
            //document.getElementById('infoModal')
        }

        closeInfo() {
            this.showModalId = -1;
        }

        getSelected(): JobDetail {
            for (var i = 0; i < this.jobs.length; i++)
                if (this.jobs[i].Id == this.showModalId)
                    return this.jobs[i];
            return new JobDetail();
        }

        jobs: Array<JobDetail>;
        showModalId: number;
    }

    interface IAppCtx {
        jobs: JobList;
    }

    function jobComponent(jobList: JobList, jd: JobDetail): IBobrilComponent {
        return {
            tag: "div",
            component: JobComponent,
            data: {
                job: jd,
                onDelete: (id: number) => jobList.deleteJob(id),
                onInfo: (id: number) => jobList.showInfo(id)
            }
        }
    }

    var App: IBobrilComponent = {
        init(ctx: IAppCtx, me: IBobrilNode): void {
            ctx.jobs = new JobList();
        },

        render(ctx: IAppCtx, me: IBobrilNode): void {
            me.tag = "div";
            me.children = [
                jobDetailModal(ctx.jobs.getSelected(),() => ctx.jobs.closeInfo()),
                {
                    tag: "table",
                    className: "table table-hover",
                    children: [
                        h("tr", [
                            h("th", "Title"),
                            h("th", "Action")
                        ]),
                        ctx.jobs.jobs.map(jd => jobComponent(ctx.jobs, jd))
                    ]
                }];
        }
    }

    b.init(() => {
        b.invalidate();
        return [
            h("h3", "GMC Software open positions"),
            {
                tag: "div",
                component: App
            }
        ];
    });
}
