using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

using ServiceStack.Text;

namespace Owin.Samples.Jobs
{
    public class GmcJobList : IJobList
    {
        readonly List<Job> _jobs = new List<Job>();

        class JobJson
        {
            public List<Job> Jobs { get; set; }
        }

        public GmcJobList()
        {
            var assembly = Assembly.GetExecutingAssembly();
            using (var reader = new StreamReader(assembly.GetManifestResourceStream("Owin.Samples.Jobs.gmcjobs.json")))
            {
                _jobs = JsonSerializer.DeserializeFromReader<JobJson>(reader).Jobs;
            }
        }

        public Task<List<Job>> ListJobs()
        {
            return Task.FromResult(_jobs);
        }

        public void DeleteJob(int id)
        {
            _jobs.RemoveAll(j => j.Id == id);
        }

        public Task<Job> GetJob(int id)
        {
            var job = _jobs.Find(j => j.Id == id);
            if (job == null)
                throw new Exception(string.Format("Job id {0} not found.", id));
            return Task.FromResult(job);
        }
    }

}
