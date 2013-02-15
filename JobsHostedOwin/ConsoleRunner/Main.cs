using System;
using Microsoft.Owin.Hosting;
using Owin.Samples.JobsOwin;

namespace Owin.Samples.ConsoleRunner
{
    class MainClass
    {
        static void Main(string[] args)
        {
            const string url = "http://+:8080";

            using (WebApplication.Start<Startup>(url))
            {
                Console.WriteLine("Running server on {0}", url);
                Console.WriteLine("Press enter to exit");
                Console.ReadLine();
            }
        }
    }
}
