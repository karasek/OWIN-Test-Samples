using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Owin.Samples.Jobs;
using Owin.Types;

namespace Owin.Samples.JobsOwin
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseFunc(LogBefore);
            app.UseShowExceptions();
            app.UseStatic(".", new List<string> { "/favicon.ico", "/images", "/html", "/css" });

            app.Run(WebApp.App(new GmcJobList()));
        }

        static Func<IDictionary<string, object>, Task> LogBefore(Func<IDictionary<string, object>, Task> next)
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

