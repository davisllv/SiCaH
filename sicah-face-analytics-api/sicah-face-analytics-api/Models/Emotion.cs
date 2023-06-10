using Newtonsoft.Json;

namespace sicah_face_analytics_api.Models
{
    public class Emotion
    {
        [JsonProperty("emotion")]
        public required string Description { get; set; }

        public decimal Confidence { get; set; }

        public DateTime DateTime { get; set; }
    }
}
