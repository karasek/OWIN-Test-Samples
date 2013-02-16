namespace Owin.Samples.JobsNancy
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseNancy(new NancyBootstrapper());
        }
    }
}
