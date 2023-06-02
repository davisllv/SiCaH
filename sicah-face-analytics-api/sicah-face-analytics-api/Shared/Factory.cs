using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using System.Text;

namespace sicah_face_analytics_api.Shared
{
    public class Factory
    {
        public static HttpResponseData HttpResponseDataFactory(HttpRequestData req, HttpStatusCode statusCode, string message, string headerName, string headerValue, Encoding encoding = null)
        {
            var httpResponseData = req.CreateResponse(statusCode);
            httpResponseData.Headers.Add(headerName, headerValue);
            httpResponseData.WriteString(message, encoding);
            return httpResponseData;
        }
    }
}
