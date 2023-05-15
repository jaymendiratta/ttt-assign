import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { CSVLink } from 'react-csv';
import "./task.css";

function Task() {
  const [wordFrequency, setWordFrequency] = useState({});
  const chartInstance = useRef(null);

  useEffect(() => {
    if (Object.keys(wordFrequency).length === 0) return;

    const ctx = document.getElementById('chart').getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = Object.keys(wordFrequency).sort(
      (a, b) => wordFrequency[b] - wordFrequency[a]
    ); 
    const data = Object.values(wordFrequency)
      .sort((a, b) => b - a)
      .slice(0, 20); 

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Word Frequency',
            data,
            backgroundColor: '#007bff',
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    chartInstance.current = chart;

    return () => {
      chartInstance.current.destroy();
    };
  }, [wordFrequency]);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        'https://www.terriblytinytales.com/test.txt'
      );
      const text = response.data;
      const words = text.split(/\s+/);
      const frequencies = {};

      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();
        if (frequencies[word]) {
          frequencies[word]++;
        } else {
          frequencies[word] = 1;
        }
      }

      setWordFrequency(frequencies);
    } catch (error) {
      console.log(error);
    }
  };

  const csvData = [
    ['Word', 'Frequency'],
    ...Object.entries(wordFrequency).sort(([, a], [, b]) => b - a),
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <button className="btn btn-primary mr-2" onClick={handleSubmit}>
            Submit
          </button>
          <br></br>
          <CSVLink
            className="btn btn-secondary"
            data={csvData}
            filename="word_frequency.csv"
          >
            Export
          </CSVLink>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <canvas id="chart" />
        </div>
      </div>
    </div>
  );
}

export default Task;





