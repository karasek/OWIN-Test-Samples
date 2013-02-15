using System.Collections.Generic;

namespace Owin.Samples.Jobs
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IList<string> Required { get; set; }
        public string Language { get; set; }
    }
}
