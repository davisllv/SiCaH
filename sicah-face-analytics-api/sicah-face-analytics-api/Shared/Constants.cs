namespace sicah_face_analytics_api.Shared
{
    public class Constants
    {
        public const string ContentType = "Content-Type";
        public const string ContentTypeText = "text/plain; charset=utf-8";
        public const string ContentTypeJson = "application/json";

        public static readonly Dictionary<string, string> TranslatedEmotions = new()
        {
            { "HAPPY", "Feliz" },
            { "SURPRISED", "Supreso" },
            { "CALM", "Calmo" },
            { "ANGRY", "Irritado" },
            { "FEAR", "Amedrontado" },
            { "CONFUSED", "Confuso" },
            { "DISGUSTED", "Aborrecido" },
            { "SAD", "Triste" }
        };
    }
}
