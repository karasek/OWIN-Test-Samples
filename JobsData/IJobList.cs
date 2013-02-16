using System.Collections.Generic;
using System.Threading.Tasks;

namespace Owin.Samples.Jobs
{
    public interface IJobList
    {
        Task<List<Job>> ListJobs();

        Task<Job> GetJob(int id);

        void AddJob(Job job);

        void DeleteJob(int id);
    }
}

