import './style.css';
import React, { useEffect, useState } from 'react';
import { Spin, DatePicker, Select, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import emotionService from '../../services/emotion-service';
import EmptyResult from '../../assets/empty-result.jpg';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedOption, setSelectedOption] = useState('day');
  const [calendarType, setCalendarType] = useState('');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [dayChartData, setDayChartData] = useState([]);
  const [multipleChartsData, setMultipleChartsData] = useState([]);
  const selectOptions = [
    {
      value: 'day',
      label: 'Dia'
    },
    {
      value: 'week',
      label: 'Semana'
    },
    {
      value: 'month',
      label: 'Mês'
    },
    {
      value: 'year',
      label: 'Ano'
    }
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const navigateToDetect = () => {
    navigate('detect');
  }

  const handleSelectedDate = (date, option = null) => {
    const finalOption = !option ? selectedOption : option;
    switch (finalOption) {
      case 'week':
        date = dayjs(date).startOf('week');
        break;

      case 'month':
        date = dayjs(date).startOf('month');
        break;

      case 'year':
        date = dayjs(date).startOf('year');
        break;

      default:
        break
    }

    return date;
  }

  const dateChanged = (date) => {
    setSelectedDate(date);
    handleDateFormat(selectedOption, date);
    const handledDate = handleSelectedDate(date);
    fetchData(dayjs(handledDate).format('YYYY-MM-DD'), selectedOption);
  }

  const reportTypeChanged = (data) => {
    setCalendarType(data.key);
    setSelectedOption(data.key);
    handleDateFormat(data.key, selectedDate);
    const handledDate = handleSelectedDate(selectedDate, data.key);
    fetchData(dayjs(handledDate).format('YYYY-MM-DD'), data.key);
  }

  const weekFormat = 'DD/MM';
  const customWeekStartEndFormat = (value) => {
    return `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)} - ${dayjs(value).format('YYYY')}`;
  }

  const handleDateFormat = (type, date) => {
    switch (type) {
      case 'day':
        setDateFormat('DD/MM/YYYY');
        break;

      case 'week':
        setDateFormat(customWeekStartEndFormat(date));
        break;

      case 'month':
        setDateFormat('MM/YYYY');
        break;

      default:
        break;
    }
  }

  const fetchData = (date, dateType) => {
    setLoading(true);
    emotionService.getEmotionsReport(date, dateType).then((response) => {
      setData(response.data);
      if (!dateType || dateType === 'day') {
        flatDataForDayChart(response.data);
      } else {
        multipleChartsDataHandler(response.data, dateType);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchData(dayjs(selectedDate).format('YYYY-MM-DD'));
  }, []);

  const flatDataForDayChart = responseData => {
    if (!responseData) {
      return;
    }

    const flattenedData = [];
    for (const [key, value] of Object.entries(responseData)) {
      if (value.length === 0) {
        flattenedData.push({
          x: key.charAt(0).toUpperCase() + key.slice(1),
          total: 0
        });
      } else {
        flattenedData.push({
          x: key.charAt(0).toUpperCase() + key.slice(1),
          total: value[0].Total
        });
      }
    }

    setDayChartData(flattenedData);
  }

  const multipleChartsDataHandler = (responseData, dateType) => {
    if (!responseData) {
      return null;
    }
    const finalData = [];
    for (const [key, value] of Object.entries(responseData)) {
      const flattenedData = [];
      for (const [key1, value1] of Object.entries(value)) {
        flattenedData.push({
          x: dateType === 'week' ? weekDays[+key1] : key1,
          total: value1.Total
        });
      }

      finalData.push(flattenedData);
    }

    setMultipleChartsData(finalData);
  }

  const emptyResultComponent =
    <div className="empty-result">
      <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
      <p>Nenhum relatório encontrado</p>
    </div>

  const gridColsClassname = option => {
    switch (option) {
      case 'day':
        return 'grid-1-col';

      default:
        return 'grid-2-col';
    }
  }

  const loadingComponent =
    <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size='large' indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </div>

  const dayCharts =
    <ResponsiveContainer>
      <BarChart
        width={500}
        height={300}
        data={dayChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray={'3 3'} />
        <XAxis dataKey="x" />
        <YAxis tickCount={1} />
        <Tooltip />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>

  const multipleCharts =
    multipleChartsData.map((data, index) => (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} key={index}>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }}>{data[0].legend}</p>
        <ResponsiveContainer>
          <BarChart
            width='100%'
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray={'3 3'} />
            <XAxis dataKey="x" />
            <YAxis tickCount={1} />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ))

  const resultCharts =
    <React.Fragment>
      {selectedOption === 'day' &&
        dayCharts
      }
      {selectedOption !== 'day' &&
        multipleCharts
      }
    </React.Fragment>

  const resultContainer =
    <div className={`report-grid ${gridColsClassname(selectedOption)}`}>
      {resultCharts}
    </div>

  return (
    <div className="user-container">
      <div className="dflex">
        <h2>Relatórios</h2>
      </div>
      <div className='dflex justify-content-between'>
        <div>
          <Select
            defaultValue={selectedOption}
            onChange={reportTypeChanged}
            options={selectOptions}
            labelInValue={true}
            style={{ width: 100, marginRight: '1rem' }}
            disabled={loading}
          />
          <DatePicker defaultValue={selectedDate} format={dateFormat} onChange={dateChanged} picker={calendarType} />
        </div>
        <Button type="primary" onClick={navigateToDetect}>Detectar humor</Button>
      </div>
      {!loading &&
        <div style={{ height: '100%' }}>
          {!data &&
            emptyResultComponent
          }

          {data &&
            resultContainer
          }
        </div>
      }
      {
        loading &&
        loadingComponent
      }
    </div >
  )
}