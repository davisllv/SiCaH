using Microsoft.Data.SqlClient;
using System.Data;

namespace sicah_face_analytics_api.Repositories
{
    public class EmotionRepository
    {
        private readonly string? _connectionString;

        public EmotionRepository()
        {
            _connectionString = Environment.GetEnvironmentVariable("ConnectionString");
        }

        public void InsertEmotion(string emotion, DateTime dateTime)
        {
            var sqlConnection = new SqlConnection(_connectionString);

            try
            {
                var query = "INSERT INTO humor VALUES (@emotion, @datetime)";
                var command = new SqlCommand(query, sqlConnection);
                command.Parameters.AddWithValue("@emotion", emotion);
                command.Parameters.AddWithValue("@datetime", dateTime);
                sqlConnection.Open();
                command.ExecuteNonQuery();
            }
            finally
            {
                if (sqlConnection.State != ConnectionState.Closed)
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
