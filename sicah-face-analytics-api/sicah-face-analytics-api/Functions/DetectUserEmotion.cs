using System.Net;
using Amazon.Rekognition;
using Amazon.Rekognition.Model;
using HttpMultipartParser;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using sicah_face_analytics_api.Models;
using sicah_face_analytics_api.Shared;
using Attribute = Amazon.Rekognition.Attribute;

namespace sicah_face_analytics_api.Functions
{
    public class DetectUserEmotion
    {
        private readonly RecognitionClient _recognitionClient;
        private readonly ILogger _logger;

        public DetectUserEmotion(RecognitionClient recognitionClient, ILoggerFactory loggerFactory)
        {
            _recognitionClient = recognitionClient;
            _logger = loggerFactory.CreateLogger<DetectEmotion>();
        }

        [Function("DetectUserEmotion")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            try
            {
                var formData = await MultipartFormDataParser.ParseAsync(req.Body);
                var body = await new StreamReader(req.Body).ReadToEndAsync();
                var image = formData.Files[0];
                var detectEmotionInput = JsonConvert.DeserializeObject<DetectEmotionInput>(body);
                if (detectEmotionInput == null)
                {
                    return Factory.HttpResponseDataFactory
                    (
                       req,
                       HttpStatusCode.BadRequest,
                       "Certifique-se de que foram informados o id do usuário e a imagem em formato base64",
                       Constants.ContentType,
                       Constants.ContentTypeText
                    );
                }

                if (detectEmotionInput.UserId == 0)
                {
                    return Factory.HttpResponseDataFactory
                    (
                        req,
                        HttpStatusCode.BadRequest,
                        "Certifique-se de que o id do usuário é válido",
                        Constants.ContentType,
                        Constants.ContentTypeText
                    );
                }

                if (string.IsNullOrEmpty(detectEmotionInput.Base64))
                {
                    return Factory.HttpResponseDataFactory
                    (
                        req,
                        HttpStatusCode.BadRequest,
                        "Certifique-se de que a imagem está em formato base64",
                        Constants.ContentType,
                        Constants.ContentTypeText
                    );
                }

                byte[] picture = Convert.FromBase64String(detectEmotionInput.Base64 ?? "");
                var pictureStream = new MemoryStream(picture)
                {
                    Position = 0
                };

                var request = new DetectFacesRequest
                {
                    Image = new Image()
                    {
                        Bytes = pictureStream
                    },
                    Attributes = new List<string> { Attribute.ALL }
                };


                var response = await _recognitionClient.client!.DetectFacesAsync(request);
                var detectEmotionOutput = response.FaceDetails;
                if (!response.FaceDetails.Any())
                {
                    return Factory.HttpResponseDataFactory(req, HttpStatusCode.OK, "Nenhum rosto foi encontrado", Constants.ContentType, Constants.ContentTypeText);
                }

                if (response.FaceDetails.Count == 1)
                {
                    var faceDetail = response.FaceDetails[0];
                    var highestConfidenceEmotion = faceDetail.Emotions.MaxBy(emotion => emotion.Confidence);
                    var dic = new Dictionary<string, dynamic>
                {
                    { "emocao", Constants.TranslatedEmotions[highestConfidenceEmotion!.Type] },
                    { "confianca", highestConfidenceEmotion!.Confidence }
                };

                    var dicAsJson = JsonConvert.SerializeObject(dic);
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
