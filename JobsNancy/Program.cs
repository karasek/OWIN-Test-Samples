using System;
using Microsoft.Owin.Hosting;

namespace Owin.Samples.JobsNancy
{
    class Program
    {
        static void Main(string[] args)
        {
            const string url = "http://localhost:8080";
            using (WebApplication.Start<Startup>(url))
            {
                Console.WriteLine("Running on {0}", url);
                Console.WriteLine("Press enter to exit");
                Console.ReadLine();
            }
        }
    }
}