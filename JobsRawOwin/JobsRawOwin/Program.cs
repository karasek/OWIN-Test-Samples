using System;
using Flux;
using Owin.Samples.Jobs;

namespace Owin.Samples.JobsRawOwin
{    
	public class Program
	{
		static void Main(string[] args)
		{
            using (var server = new Server(8080))
            {
                server.Start(WebApp.App(new GmcJobList()));                

                Console.WriteLine("Running server");
                Console.WriteLine("Press enter to exit");
                Console.ReadLine();

                server.Stop( );
            }
		}
        
	}
}
