using Microsoft.Data.SqlClient;
using sicah_face_analytics_api.Models;
using System.Data;
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

        public ComplexEmotion? GetEmotionsReportByType(DateTime datetime, DateType dateType)
        {
            string query = $"SELECT * FROM humor WHERE CONVERT(DATE, data) BETWEEN '{datetime:yyyy-MM-dd}' AND ";
            DateTime end;
            switch (dateType)
            {
                case DateType.day:
                    end = datetime.AddDays(1).AddMinutes(-1);
                    break;

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

            query += $"'{end:yyyy-MM-dd}'";
            var sqlConnection = new SqlConnection(_connectionString);
            var results = new List<Emotion>();
            try
            {
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

            if (results.Any())
            {
                var complexEmotion = HandleComplexEmotion(datetime, dateType);
                var groupByDescription = results.GroupBy(e => e.Description);
                foreach (var group in groupByDescription)
                {
                    switch (group.Key)
                    {
                        case "Feliz":
                            if (!complexEmotion.Happy.Any())
                            {
                                complexEmotion.Happy = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Happy.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Supreso":
                            if (!complexEmotion.Surprised.Any())
                            {
                                complexEmotion.Surprised = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Surprised.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Calmo":
                            if (!complexEmotion.Calm.Any())
                            {
                                complexEmotion.Calm = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Calm.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Irritado":
                            if (!complexEmotion.Angry.Any())
                            {
                                complexEmotion.Angry = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Angry.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Amedrontado":
                            if (!complexEmotion.Fear.Any())
                            {
                                complexEmotion.Fear = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Fear.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Confuso":
                            if (!complexEmotion.Confused.Any())
                            {
                                complexEmotion.Confused = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Confused.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Aborrecido":
                            if (!complexEmotion.Disgusted.Any())
                            {
                                complexEmotion.Disgusted = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Disgusted.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        case "Triste":
                            if (!complexEmotion.Sad.Any())
                            {
                                complexEmotion.Sad = HandleData(group.ToList(), dateType);
                            }
                            else
                            {
                                HandleData(group.ToList(), dateType).ForEach(e => complexEmotion.Sad.First(c => c.XValue == e.XValue).Total = e.Total);
                            }
                            break;

                        default:
                            break;
                    }
                }

                return complexEmotion;
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
                        XValue = xValue.ToString(),
                        Total = 0,
                    };

                    list.Add(data);
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

        private List<int> HandleXAxisValues(DateTime datetime, DateType dateType)
        {
            var xAxisValues = new List<int>();

            switch (dateType)
            {
                case DateType.week:
                    for (var i = 0; i < 7; i++)
                    {
                        xAxisValues.Add(i);
                    }

                    break;

                case DateType.month:
                    var lastDayOfTheMonth = datetime.AddMonths(1).AddDays(-1);
                    for (var i = datetime.Day; i <= lastDayOfTheMonth.Day; i++)
                    {
                        xAxisValues.Add(i);
                    }

                    break;

                case DateType.year:
                    for (var i = 1; i <= 12; i++)
                    {
                        xAxisValues.Add(i);
                    }

                    break;
            }

            return xAxisValues;
        }

        private List<Data> HandleData(IEnumerable<Emotion> emotions, DateType dateType)
        {
            var data = new List<Data>();
            if (dateType != DateType.day)
            {
                List<IGrouping<int, Emotion>> groupBy = new List<IGrouping<int, Emotion>>();
                switch (dateType)
                {
                    case DateType.week:
                        groupBy = emotions.GroupBy(e => (int)e.DateTime.DayOfWeek).ToList();
                        break;
                    case DateType.month:
                        groupBy = emotions.GroupBy(e => e.DateTime.Day).ToList();
                        break;
                    case DateType.year:
                        groupBy = emotions.GroupBy(e => e.DateTime.Month).ToList();
                        break;
                }

                foreach (var group in groupBy)
                {
                    data.Add(new Data
                    {
                        Total = group.ToList().Count,
                        XValue = group.Key.ToString(),
                    });
                }
            }
            else
            {
                List<IGrouping<string, Emotion>> groupBy = emotions.GroupBy(e => e.Description).ToList();
                foreach (var group in groupBy)
                {
                    data.Add(new Data
                    {
                        Total = group.ToList().Count,
                        XValue = group.Key,
                    });
                }
            }

            return data;
        }
    }
}
