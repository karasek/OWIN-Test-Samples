using System.Linq;
using FluentAssertions;
using NUnit.Framework;

namespace Owin.Samples.Jobs.Test
{
    [TestFixture]
    public class Test
    {
        IJobList _jobList;

        [SetUp]
        public void SetUp()
        {
            _jobList = new GmcJobList();
        }

        [Test]
        public void JobsAreListed()
        {
            var jobs = _jobList.ListJobs().Result;
            jobs.Should().HaveCount(6);
        }

        [Test]
        public void JobCanBeDeleted()
        {
            var jobs = _jobList.ListJobs().Result;
            var count = jobs.Count();
            Assert.That(count, Is.GreaterThanOrEqualTo(1));
            var id = jobs.First().Id;
            _jobList.DeleteJob(id);
            Assert.That(jobs.Count(), Is.EqualTo(count - 1));
        }
    }
}

