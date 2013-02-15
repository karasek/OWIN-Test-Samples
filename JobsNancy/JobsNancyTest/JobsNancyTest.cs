using NUnit.Framework;
using Nancy;
using Nancy.Testing;
using Owin.Samples.JobsNancy;

namespace Owin.Samples.JobsNancyTest
{
    [TestFixture]
    public class JobsNancyTest
    {
        [Test]
        public void Should_return_status_ok_when_route_exists()
        {
            // Given
            var bootstrapper = new NancyBootstrapper();
            var browser = new Browser(bootstrapper);

            // When
            var result = browser.Get("/", with => with.HttpRequest());

            // Then
            Assert.That(HttpStatusCode.OK, Is.EqualTo(result.StatusCode));
        }

        [Test]
        public void Should_return_status_notfound_on_invalid_route()
        {
            // Given
            var bootstrapper = new NancyBootstrapper();
            var browser = new Browser(bootstrapper);

            // When
            var result = browser.Get("/bad", with => with.HttpRequest());

            // Then
            Assert.That(HttpStatusCode.NotFound, Is.EqualTo(result.StatusCode));
        }
    }
}