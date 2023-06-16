using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Newtonsoft.Json;
using sicah_face_analytics_api.Repositories;
using sicah_face_analytics_api.Shared;
using System.Net;

namespace sicah_face_analytics_api.Functions
{
    public class GetDashboard
    {
        private readonly EmotionRepository _emotionRepository;

        public GetDashboard(EmotionRepository emotionRepository)
        {
            _emotionRepository = emotionRepository;
        }

        [Function("GetDashboard")]
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            var result = _emotionRepository.GetEmotionsDashboard();
            string resultAsJson = JsonConvert.SerializeObject(result);
            return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, resultAsJson, Constants.ContentType, Constants.ContentTypeJson);
        }
    }
}
