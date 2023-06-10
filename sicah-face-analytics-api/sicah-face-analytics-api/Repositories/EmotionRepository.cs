using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using sicah_face_analytics_api.Models;
using System.Data;
using System.Globalization;
using System.Xml;
using static sicah_face_analytics_api.Shared.Constants;

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

        public IEnumerable<Emotion> GetEmotionsReport(DateTime? dateTime = null)
        {
            var results = new List<Emotion>();
            var sqlConnection = new SqlConnection(_connectionString);

            try
            {
                var query = "SELECT * FROM humor";
                if (dateTime.HasValue)
                {
                    query += $" WHERE CONVERT(DATE, [data]) = '{dateTime.Value:yyyy-MM-dd}'";
                }

                var command = new SqlCommand(query, sqlConnection);
                sqlConnection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var emotion = new Emotion
                    {
                        Description = reader["emocao"].ToString() ?? "",
                        DateTime = DateTime.Parse(reader["data"].ToString()),
                    };

                    results.Add(emotion);
                }
            }
            finally
            {
                if (sqlConnection.State != ConnectionState.Closed)
                {
                    sqlConnection.Close();
                }
            }

            return results;
        }

        public ComplexEmotion? GetEmotionsReportByType(DateTime datetime, DateType dateType)
        {
            string query = $"SELECT * FROM humor WHERE CONVERT(DATE, data) BETWEEN '{datetime:yyyy-MM-dd}' AND ";
            DateTime end;
            switch (dateType)
            {
                case DateType.week:
                    end = datetime.AddDays(7);
                    break;

                case DateType.month:
                    end = datetime.AddMonths(1).AddDays(-1);
                    break;

                default:
                    end = datetime.AddYears(1).AddDays(-1);
                    break;
            }

            query += $"'{end}'";
            var sqlConnection = new SqlConnection(query);
            var results = new List<Emotion>();
            try
            {
                var command = new SqlCommand(query, sqlConnection);
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var emotion = new Emotion
                    {
                        Description = reader["emocao"].ToString() ?? "",
                        DateTime = DateTime.Parse(reader["data"].ToString()),
                    };

                    results.Add(emotion);
                }
            }
            finally
            {
                if (sqlConnection.State != ConnectionState.Closed)
                {
                    sqlConnection.Close();
                }
            }

            if (results.Any())
            {
                var complexEmotion = HandleComplexEmotion(datetime, dateType);
                var groupByDescription = results.GroupBy(e => e.Description);
                foreach (var group in groupByDescription)
                {
                    IEnumerable<Emotion> filtered = results.Where(e => e.Description == group.Key);
                    IEnumerable<IGrouping<int, Emotion>> filteredByXValue;
                    switch (dateType)
                    {
                        case DateType.week:
                            filteredByXValue = filtered.GroupBy(e => CultureInfo.CreateSpecificCulture("pt-BR").Calendar.GetWeekOfYear(e.DateTime, CalendarWeekRule.FirstFullWeek, DayOfWeek.Sunday));
                            break;
                        case DateType.month:

                            break;
                        case DateType.year:
                            break;
                        default:
                            break;
                    }
                }
            }

            return null;
        }

        private ComplexEmotion HandleComplexEmotion(DateTime datetime, DateType dateType)
        {
            var complexEmotion = new ComplexEmotion();
            var xValues = HandleXAxisValues(datetime, dateType);
            List<Data> PopulateEmotionData()
            {
                var list = new List<Data>();

                foreach (var xValue in xValues)
                {
                    var data = new Data
                    {
                        XValue = xValue,
                        Total = 0,
                    };
                }

                return list;
            }

            complexEmotion.Happy = PopulateEmotionData();
            complexEmotion.Surprised = PopulateEmotionData();
            complexEmotion.Calm = PopulateEmotionData();
            complexEmotion.Angry = PopulateEmotionData();
            complexEmotion.Fear = PopulateEmotionData();
            complexEmotion.Confused = PopulateEmotionData();
            complexEmotion.Disgusted = PopulateEmotionData();
            complexEmotion.Sad = PopulateEmotionData();
            return complexEmotion;
        }

        private List<string> HandleXAxisValues(DateTime datetime, DateType dateType)
        {
            var xAxisValues = new List<string>();

            switch (dateType)
            {
                case DateType.week:
                    for (var i = 0; i < 7; i++)
                    {
                        xAxisValues.Add(CultureInfo.GetCultureInfo("pt-BR").DateTimeFormat.DayNames[i]);
                    }

                    break;
                case DateType.month:
                    var lastDayOfTheMonth = datetime.AddMonths(1).AddDays(-1);
                    for (var i = datetime.Day; i <= lastDayOfTheMonth.Day; i++)
                    {
                        xAxisValues.Add($"{i}");
                    }

                    break;
                case DateType.year:
                    for (var i = 1; i <= 12; i++)
                    {
                        xAxisValues.Add(CultureInfo.CreateSpecificCulture("pt-BR").DateTimeFormat.MonthNames[i]);
                    }

                    break;
            }

            return xAxisValues;
        }
    }
}
