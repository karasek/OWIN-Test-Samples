/// <reference path="lib/bobril.d.ts"/>

module JobsApp {
    function h(tag: string, ...args: any[]) {
        return { tag: tag, children: args };
    }

    class JobDetail {
        Title: string;
        Description: string;
        Requirements: string;
        Required: Array<string>;
        Language: string;
    }

    interface IJobCtx{
        data: JobDetail;
    }

    class Job implements IBobrilComponent{
        static render(ctx: IJobCtx, me: IBobrilNode, oldMe?: IBobrilCacheNode): void {
            me.tag = "li";
            me.children = ctx.data.Title + " " + ctx.data.Description;
        }
    }

    class JobList {
        constructor(){
            this.loadFromServerSync();
        }

        loadFromServerSync(){
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", "../jobs", false);
            xhReq.send(null);
            this.jobs = <Array<JobDetail>>(JSON.parse(xhReq.responseText));
        }

        jobs: Array<JobDetail>;
    }

    interface IAppCtx {
        jobs: JobList;
    }

    function jobComponent(jd: JobDetail) {
        return { tag: "div", component: Job, data: jd };
    }

    class App implements IBobrilComponent {
        static init(ctx: IAppCtx, me: IBobrilNode): void{
            ctx.jobs = new JobList();
        } 

        static render(ctx: IAppCtx, me: IBobrilNode, oldMe?: IBobrilCacheNode): void{
            me.tag = "ul";
            me.children = [ ctx.jobs.jobs.map(jd => jobComponent(jd)) ];
        }
    }

    b.init(() => {
        b.invalidate();
        return [
            h("h1", "GMC Jobs"),
            {
                tag: "div",
                component: App
            }
        ];
    });
}
