OWIN-Test-Samples
=================

**Few examples demonstrating OWIN usage**  
**prerequisites:** .NET framework 4.5 installed, use [SharpDevelop](http://www.icsharpcode.net/opensource/sd/) or VS2012 IDE to play with

JobsData [>](https://github.com/karasek/OWIN-Test-Samples/tree/master/JobsData)
--------
simple data layer for examples

JobsRawOwin [>](https://github.com/karasek/OWIN-Test-Samples/tree/master/JobsRawOwin)
-----------
Simple [OWIN](http://owin.org/) web application hosted on [Flux](https://github.com/markrendle/Flux) server,
no other OWIN dependencies

JobsHostedOwin [>](https://github.com/karasek/OWIN-Test-Samples/tree/master/JobsHostedOwin)
--------------
The same [OWIN](http://owin.org/) application as JobsRawOwin, used NuGet packages
*  Owin
*  Microsoft.Owin.Host.HttpListener
*  Microsoft.Owin.Hosting
*  ServiceStack.Text

JobsNancy [>](https://github.com/karasek/OWIN-Test-Samples/tree/master/JobsNancy)
---------
Single page [Angular](http://angularjs.org/) application, backend in [Nancy](http://nancyfx.org/), hosted
on Microsoft.Owin.Host.HttpListener
