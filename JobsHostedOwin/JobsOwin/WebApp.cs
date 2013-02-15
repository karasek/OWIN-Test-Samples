using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Owin.Samples.Jobs;
using Owin.Types;
using ServiceStack.Text;

namespace Owin.Samples.JobsOwin
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    public class WebApp
    {
        readonly IJobList _jobList;

        public WebApp(IJobList jobList)
        {
            _jobList = jobList;
        }

        public static AppFunc App(IJobList jobList)
        {
            return new WebApp(jobList).Invoke;
        }

        public async Task Invoke(IDictionary<string, object> env)
        {
            var request = new OwinRequest(env);
            var response = new OwinResponse(env);

            int id;
            if (int.TryParse(request.Path.Substring(1), out id))
            {
                switch (request.Method)
                {
                    case "GET":
                        var job = await _jobList.GetJob(id);
                        JsonSerializer.SerializeToStream(job, response.Body);
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
                JsonSerializer.SerializeToStream(await _jobList.ListJobs(), response.Body);
            }
        }
    }
}
