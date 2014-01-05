using System;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Conventions;
using Nancy.TinyIoc;
using Owin.Samples.Jobs;

namespace Owin.Samples.JobsNancy
{
    public class NancyBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);
            container.Register<IJobList>(new GmcJobList());
        }

        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(
                          StaticContentConventionBuilder.AddDirectory("static", @"static"));

            base.ConfigureConventions(nancyConventions);
        }

        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
            pipelines.BeforeRequest += ctx =>
            {
                Console.WriteLine("Executing request {0} {1}", ctx.Request.Method, ctx.Request.Path);
                return null;
            };
        }

        protected override IRootPathProvider RootPathProvider
        {
            get
            {
                return new CustomRootPathProvider();
            }
        }
    }
}