namespace sicah_face_analytics_api.Models
{
    public class DetectEmotionInput
    {
        public int UserId { get; set; }

        public string? Base64 { get; set; }
    }
}
