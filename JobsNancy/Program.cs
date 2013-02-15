using System;
using Nancy.Hosting.Self;

namespace Owin.Samples.JobsNancy
{
    class Program
    {
        static void Main(string[] args)
        {
            const string url = "http://localhost:8080";
            var nancyHost = new NancyHost(new Uri(url));
            nancyHost.Start();

            Console.WriteLine("Running server on {0}", url);
            Console.WriteLine("Press enter to exit");
            Console.ReadLine();
            
            nancyHost.Stop();
        }
    }
}