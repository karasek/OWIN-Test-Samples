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


    export interface IButtonData {
        id: number;
        label: string;
        className: string;
        perform: (id: number) => void;
    }

    export interface IButtonCtx {
        data: IButtonData;
    }

    export class ActionButton implements IBobrilComponent {
        static render(ctx: IButtonCtx, me: IBobrilNode): void {
            me.tag = "button";
            me.className = ctx.data.className;
            me.children = ctx.data.label;
        }

        static onClick(ctx: IButtonCtx, event: IMouseEvent) {
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

    interface IJobData {
        job: JobDetail;
        onDelete: (id: number) => void;
    }

    interface IJobCtx {
        data: IJobData;
    }

    class Job implements IBobrilComponent {
        static render(ctx: IJobCtx, me: IBobrilNode, oldMe?: IBobrilCacheNode): void {
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
                            perform: (id: number) => ctx.data.onDelete(id)
                        }
                    }
                ])
            ];
        }
    }

    class JobList {
        constructor() {
            this.jobs = this.loadFromServerSync();
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
                if (this.jobs[i].Id == id){
                    this.jobs.splice(i, 1);
                    break;
                }
            }
        }

        jobs: Array<JobDetail>;
    }

    interface IAppCtx {
        jobs: JobList;
    }

    function jobComponent(jobList: JobList, jd: JobDetail) {
        return {
            tag: "div",
            component: Job,
            data: {
                job: jd,
                onDelete: (id: number) => jobList.deleteJob(id)
            }
        }
    }

    class App implements IBobrilComponent {
        static init(ctx: IAppCtx, me: IBobrilNode): void {
            ctx.jobs = new JobList();
        }

        static render(ctx: IAppCtx, me: IBobrilNode, oldMe?: IBobrilCacheNode): void {
            me.tag = "div";
            me.children = [
                {
                    tag: "table",
                    className: "table table-hover",
                    children: [
                        h("tr", [
                            h("th", "Title"),
                            h("th", "Action")]),
                        ctx.jobs.jobs.map(jd => jobComponent(ctx.jobs, jd))]
                }
            ];
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
