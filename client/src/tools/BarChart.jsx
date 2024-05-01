import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function BarChart({keys,values}) {
  const data = {
    labels: keys,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false // This will hide the legend
      }
      // ,
      // title: {
      //   display: true, // This will show the title
      //   text: title, // Define the title text here
      //   font: {
      //     size: 12, // You can specify the font size and other font properties
      //     weight: 'normal'
      //   },
      //   padding: {
      //     top: 5,
      //     bottom: 5 // Adds padding around the title for better spacing
      //   },
      //   color: '#333' // Set the color of the title text
      // }


    }
  };

  return <Bar data={data} options={options} />;
}

export default BarChart;
