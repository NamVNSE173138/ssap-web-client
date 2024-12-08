import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 300,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const state: ChartOneState = ({
  // const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Subscription 1',
        data: [50, 40, 60, 80, 70, 100, 90, 120, 130, 140, 110, 150],
      },
      {
        name: 'Subscription 2',
        data: [40, 50, 70, 60, 80, 110, 100, 130, 120, 150, 140, 160],
      },
    ],
  });

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleDateChange = () => {
    // Apply logic to filter data by date range
    console.log('Filtering data from:', fromDate, 'to:', toDate);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex items-center gap-3">
            <p className="font-semibold">From:</p>
            <DatePicker
              selected={fromDate}
              onChange={(date:any) => setFromDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Start Date"
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="font-semibold">To:</p>
            <DatePicker
              selected={toDate}
              onChange={(date:any) => setToDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select End Date"
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            onClick={handleDateChange}
            className="bg-primary text-white px-4 py-2 rounded shadow"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;

