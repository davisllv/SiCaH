import './style.css';
import { useEffect, useState } from 'react';
import { Spin, DatePicker, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import emotionService from '../../services/emotion-service';
import EmptyResult from '../../assets/empty-result.jpg';

export default function Report() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedOption, setSelectedOption] = useState('day');
  const [calendarType, setCalendarType] = useState('');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

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
  ]

  const dateChanged = (date) => {
    setSelectedDate(date);
    handleDateFormat(selectedOption);
    fetchData(dayjs(date).format('YYYY-MM-DD'));
  }

  const reportTypeChanged = (data) => {
    setCalendarType(data.key);
    setSelectedOption(data.key);
    handleDateFormat(data.key);
  }

  const weekFormat = 'DD/MM';
  const customWeekStartEndFormat = (value) => {
    return `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)} - ${dayjs(value).format('YYYY')}`;
  }

  const handleDateFormat = (type) => {
    switch (type) {
      case 'day':
        setDateFormat('DD/MM/YYYY');
        break;

      case 'week':
        setDateFormat(customWeekStartEndFormat(selectedDate));
        break;

      default:
        break;
    }
  }

  const fetchData = (date) => {
    setLoading(true);
    emotionService.getEmotionsReport(date).then((response) => {
      setData(response.data);
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchData(dayjs(selectedDate).format('YYYY-MM-DD'));
  }, []);

  return (
    <div className="user-container">
      <div className="dflex">
        <h2>Relatórios</h2>
      </div>
      {loading &&
        <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size='large' indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
        </div>
      }
      {!loading &&
        <div>
          <Select
            defaultValue={selectedOption}
            onChange={reportTypeChanged}
            options={selectOptions}
            labelInValue={true}
            style={{ width: 100, marginRight: '1rem' }}
          />
          <DatePicker defaultValue={selectedDate} format={dateFormat} onChange={dateChanged} picker={calendarType} />
          {data.length === 0 &&
            <div className="empty-result">
              <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
              <p>Nenhum relatório encontrado</p>
            </div>
          }

          {data.length > 0 && <div>
          </div>}
        </div>
      }
    </div>
  )
}