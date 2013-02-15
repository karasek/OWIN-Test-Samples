using System;

namespace Owin.Samples.JobsNancy
{
    public class MainModule : Nancy.NancyModule
    {
        public MainModule()
        {
            Get["/"] = _ => View["index"];

            Get["/crash"] = _ => { throw new Exception("Something wrong"); };
        }
    }
}