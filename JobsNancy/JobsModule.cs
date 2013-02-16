using Nancy.ModelBinding;
using Owin.Samples.Jobs;

namespace Owin.Samples.JobsNancy
{
    public class JobsModule : Nancy.NancyModule
    {
        private readonly IJobList _jobList;

        public JobsModule(IJobList jobList)
            : base("/jobs")
        {
            _jobList = jobList;

            Get["/"] = _ => _jobList.ListJobs().Result;

            Get["/{id}"] = parameters =>
                              _jobList.GetJob(parameters.id).Result;

            Delete["/{id}"] = parameters =>
                                {
                                    _jobList.DeleteJob(parameters.id);
                                    return 200;
                                };

            Post["/add"] = _ =>
                                {
                                    var job = this.Bind<Job>();
                                    return _jobList.AddJob(job)
                                        .ContinueWith(t => _jobList.GetJob(t.Result))
                                        .Result.Result;
                                };

        }
    }
}