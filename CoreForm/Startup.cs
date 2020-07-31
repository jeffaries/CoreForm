using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DotNetify;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace CoreForm
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        internal static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCaching();
            services.AddMemoryCache();
            services.AddSignalR();
            services.AddDotNetify();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseWebSockets();
            app.UseSignalR(routes => routes.MapDotNetifyHub());
            app.UseDotNetify();

#if DEBUG
            // Optional: utilize webpack hot reload feature.
            app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
            {
                HotModuleReplacement = true,
                HotModuleReplacementClientOptions = new Dictionary<string, string> { { "reload", "true" } },
            });
#endif

            app.UseStaticFiles();
            app.UseResponseCaching();

            app.Run(async (context) =>
            {
                context.Response.GetTypedHeaders().CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    Public = true,
                    MaxAge = TimeSpan.FromSeconds(1)
                };
                context.Response.ContentType = "text/html";
                using (var reader = new StreamReader(File.OpenRead("wwwroot/index.html")))
                    await context.Response.WriteAsync(reader.ReadToEnd());
            });



        }
    }
}
