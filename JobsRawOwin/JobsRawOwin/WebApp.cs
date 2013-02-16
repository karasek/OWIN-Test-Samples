using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Owin.Samples.Jobs;
using ServiceStack.Text;
using System.IO;

namespace Owin.Samples.JobsRawOwin
{
    public class WebApp
    {
        readonly IJobList _jobList;

        public WebApp(IJobList jobList)
        {
            _jobList = jobList;
        }

        public static Func<IDictionary<string, object>, Task> App(IJobList jobList)
        {
            return new WebApp(jobList).Invoke;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            var method = (string)environment["owin.RequestMethod"];
            var path = (string)environment["owin.RequestPath"];
            var responseBody = (Stream)environment["owin.ResponseBody"];
            try
            {
                environment["owin.ResponseStatusCode"] = 200; //should be optional
                await Handle(method, path, responseBody);
            }
            catch (Exception)
            {
                environment["owin.ResponseStatusCode"] = 500;
            }
        }

        async Task Handle(string method, string path, Stream responseBody)
        {
            int id;
            if (int.TryParse(path.Substring(1), out id))
            {
                switch (method)
                {
                    case "GET":
                        var job = await _jobList.GetJob(id);
                        JsonSerializer.SerializeToStream(job, responseBody);
                        break;
                    case "DELETE":
                        _jobList.DeleteJob(id);
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
            else
            {
                JsonSerializer.SerializeToStream(await _jobList.ListJobs(), responseBody);
            }
        }
    }
}
