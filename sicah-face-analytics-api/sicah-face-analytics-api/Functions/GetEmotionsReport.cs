using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Newtonsoft.Json;
using sicah_face_analytics_api.Repositories;
using sicah_face_analytics_api.Shared;
using System.Net;

namespace sicah_face_analytics_api.Functions
{
    public class GetEmotionsReport
    {
        private readonly EmotionRepository _emotionRepository;

        public GetEmotionsReport(EmotionRepository emotionRepository)
        {
            _emotionRepository = emotionRepository;
        }

        [Function("GetEmotionsReport")]
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            var dateTime = DateTime.Parse(req.Query["datetime"]);
            var hasType = Enum.TryParse(req.Query["type"], out Constants.DateType datetype);
            string resultAsJson;
            if (!hasType)
            {
                var result = _emotionRepository.GetEmotionsReport(dateTime);
                resultAsJson = JsonConvert.SerializeObject(result);
            }
            else
            {
                var result = _emotionRepository.GetEmotionsReportByType(dateTime, datetype);
                resultAsJson = JsonConvert.SerializeObject(result);
            }

            return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, resultAsJson, Constants.ContentType, Constants.ContentTypeJson);
        }
    }
}
