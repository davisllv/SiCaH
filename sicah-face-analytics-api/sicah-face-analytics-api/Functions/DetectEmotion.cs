using Amazon.Rekognition.Model;
using HttpMultipartParser;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using sicah_face_analytics_api.Shared;
using System.Net;
using Attribute = Amazon.Rekognition.Attribute;

namespace sicah_face_analytics_api.Functions
{
    public class DetectEmotion
    {
        private readonly RecognitionClient _recognitionClient;
        private readonly ILogger _logger;

        public DetectEmotion(RecognitionClient recognitionClient, ILoggerFactory loggerFactory)
        {
            _recognitionClient = recognitionClient;
            _logger = loggerFactory.CreateLogger<DetectEmotion>();
        }

        [Function("DetectEmotion")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            try
            {
                var formData = await MultipartFormDataParser.ParseAsync(req.Body);
                var picture = formData.Files[0];
                var data = picture.Data;
                data.Position = 0;
                var ms = new MemoryStream();
                data.CopyTo(ms); 
                ms.Position = 0;
                var request = new DetectFacesRequest
                {
                    Image = new Image()
                    {
                        Bytes = ms
                    },
                    Attributes = new List<string> { Attribute.ALL }
                };


                var response = await _recognitionClient.client!.DetectFacesAsync(request);
                var detectEmotionOutput = response.FaceDetails;
                if (!response.FaceDetails.Any())
                {
                    return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, "Nenhum rosto foi encontrado", Constants.ContentType, Constants.ContentTypeText);
                }

                var emotionsOutput = new List<Dictionary<string, dynamic>>();
                if (response.FaceDetails.Count == 1)
                {
                    var faceDetail = response.FaceDetails[0];
                    var emotions = faceDetail.Emotions.OrderByDescending(emotion => emotion.Confidence);
                    foreach (var emotion in emotions)
                    {
                        var dic = new Dictionary<string, dynamic>
                        {
                            { "emotion", Constants.TranslatedEmotions[emotion.Type] },
                            { "confidence", emotion.Confidence }
                        };
                        
                        emotionsOutput.Add(dic);
                    }


                    var dicAsJson = JsonConvert.SerializeObject(emotionsOutput);
                    return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, dicAsJson, Constants.ContentType, Constants.ContentTypeJson);
                }
                else
                {
                    var faceDetails = response.FaceDetails;
                    var listResponse = new List<Dictionary<string, dynamic>>();
                    foreach (var faceDetail in faceDetails)
                    {
                        var highestConfidenceEmotion = faceDetail.Emotions.MaxBy(emotion => emotion.Confidence);
                        var dic = new Dictionary<string, dynamic>
                        {
                            { "emocao", Constants.TranslatedEmotions[highestConfidenceEmotion!.Type] },
                            { "confianca", highestConfidenceEmotion!.Confidence }
                        };

                        listResponse.Add(dic);
                    }

                    var dicAsJson = JsonConvert.SerializeObject(listResponse);
                    return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, dicAsJson, Constants.ContentType, Constants.ContentTypeJson);
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Information, ex.Message);
            }

            return Factory.HttpResponseDataFactory(req, HttpStatusCode.BadRequest, "Ocorreu um erro ao processar a imagem.", Constants.ContentType, Constants.ContentTypeText);
        }
    }
}
