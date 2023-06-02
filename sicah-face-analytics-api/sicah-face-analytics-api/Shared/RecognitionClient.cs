using Amazon.Rekognition;

namespace sicah_face_analytics_api.Shared
{
    public class RecognitionClient
    {
        private readonly string _awsAccessKeyId;
        private readonly string _awsSecretAccessKey;
        public readonly AmazonRekognitionClient? client;

        public RecognitionClient()
        {
            _awsAccessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? "";
            _awsSecretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? "";
            if (!string.IsNullOrEmpty(_awsAccessKeyId) && !string.IsNullOrEmpty(_awsSecretAccessKey))
            {
                client = new AmazonRekognitionClient(_awsAccessKeyId, _awsSecretAccessKey, Amazon.RegionEndpoint.USEast2);
            }
        }
    }
}
