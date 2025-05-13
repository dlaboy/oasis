import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function DotChart({ dataPoints }) {
  const data = {
    datasets: [
      {
        label: 'Average per Hour',
        data: dataPoints.map(point => ({
          x: point.hour,
          y: point.avg
        })),
        backgroundColor: 'rgba(221, 2, 35, 0.6)',
        pointRadius: 8, // 👈 size of the dots (default is 3)
        pointHoverRadius: 10 // optional: size when hovered
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        offset: true, // adds spacing at the chart's ends
        title: {
          display: true,
          text: 'Hour'
        },
        ticks: {
          padding: 10
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average'
        },
        ticks: {
          callback: value => value.toFixed(2)
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return <Scatter data={data} options={options} />;
}

export default DotChart;
