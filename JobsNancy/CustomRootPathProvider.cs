using System.IO;
using Nancy;

namespace Owin.Samples.JobsNancy
{
    public class CustomRootPathProvider : IRootPathProvider
    {
        readonly string _defaultRoot = new DefaultRootPathProvider().GetRootPath();

        public string GetRootPath()
        {
            var path = Path.GetFullPath(Path.Combine(_defaultRoot, "..\\.."));
            return path;
        }
    }
}