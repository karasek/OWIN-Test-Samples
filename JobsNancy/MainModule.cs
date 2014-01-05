using System;

namespace Owin.Samples.JobsNancy
{
    public class MainModule : Nancy.NancyModule
    {
        public MainModule()
        {
            Get["/"] = _ => View["index"];

            Get["/react"] = _ => View["react"];

            Get["/crash"] = _ => { throw new Exception("Something wrong"); };
        }
    }
}