using Newtonsoft.Json;

namespace sicah_face_analytics_api.Models
{
    public class ComplexEmotion
    {
        [JsonProperty("feliz")]
        public List<Data> Happy { get; set; } = new();

        [JsonProperty("surpreso")]
        public List<Data> Surprised { get; set; } = new();

        [JsonProperty("calmo")]
        public List<Data> Calm { get; set; } = new();

        [JsonProperty("irritado")]
        public List<Data> Angry { get; set; } = new();

        [JsonProperty("amedrontado")]
        public List<Data> Fear { get; set; } = new();

        [JsonProperty("confuso")]
        public List<Data> Confused { get; set; } = new();

        [JsonProperty("aborrecido")]
        public List<Data> Disgusted { get; set; } = new();

        [JsonProperty("triste")]
        public List<Data> Sad { get; set; } = new();
    }

    public class Data
    {
        [JsonProperty("descricao")]
        public required string XValue { get; set; }

        public int Total { get; set; }
    }
}
