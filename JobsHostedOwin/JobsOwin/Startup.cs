using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Owin.Samples.Jobs;
using Owin.Types;

namespace Owin.Samples.JobsOwin
{
    using AppFunc = Func<IDictionary<string, object>, Task>;
    
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseFunc(LogBefore);
            app.UseShowExceptions();
            app.UseStatic(".", new List<string> { "/favicon.ico", "/images", "/html", "/css" });

            app.Run(WebApp.App(new GmcJobList()));
        }

        static AppFunc LogBefore(AppFunc next)
        {
            return env =>
                {
                    var request = new OwinRequest(env);
                    Console.WriteLine("{0} {1}", request.Method, request.Path);
                    return next(env);
                };
        }
    }
}