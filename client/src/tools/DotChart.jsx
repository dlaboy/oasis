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
  // Orden deseado de horas
  const hourOrder = ['02 PM','03 PM','04 PM','05 PM','06 PM','07 PM','08 PM','09 PM'];

  // Agrupar por día
  const groupedByDay = dataPoints.reduce((acc, point) => {
    if (!acc[point.day]) acc[point.day] = [];
    acc[point.day].push({ x: point.hour, y: point.avg });
    return acc;
  }, {});

  // Ordenar internamente los puntos por hora
  Object.keys(groupedByDay).forEach(day => {
    groupedByDay[day].sort((a, b) => {
      return hourOrder.indexOf(a.x) - hourOrder.indexOf(b.x);
    });
  });

  const colors = [
    'rgba(255, 99, 132, 0.7)',   // Monday
    'rgba(54, 162, 235, 0.7)',   // Tuesday
    'rgba(255, 206, 86, 0.7)',   // Wednesday
    'rgba(75, 192, 192, 0.7)',   // Thursday
    'rgba(153, 102, 255, 0.7)',  // Friday
    'rgba(255, 159, 64, 0.7)',   // Saturday
    'rgba(201, 203, 207, 0.7)'   // Sunday
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const data = {
    labels: hourOrder, // 👈 Aquí defines el orden explícito
    datasets: daysOfWeek.map((day, index) => ({
      label: day,
      data: groupedByDay[day] || [],
      backgroundColor: colors[index % colors.length],
      pointRadius: 6,
      pointHoverRadius: 8
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Hora'
        },
        ticks: {
          padding: 10
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Promedio'
        },
        ticks: {
          callback: value => value.toFixed(2)
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default DotChart;
