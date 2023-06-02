using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using sicah_face_analytics_api.Shared;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddSingleton<RecognitionClient>();
    })
    .Build();

host.Run();
