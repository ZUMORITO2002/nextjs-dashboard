"use client"

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface SalaryDataItem {
  month: string;
  salary: number;
}

interface YourComponentProps {
  employeeId: string;
}

const EditEmployeeForm: React.FC<YourComponentProps> = ({ employeeId }) => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [chartData, setChartData] = useState<SalaryDataItem[]>([]);
  const chartRef = useRef<Chart | null>(null);

  const handleYearChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    setSelectedYear(year);
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_monthly_salary_by_year/${employeeId}/${year}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: SalaryDataItem[] = await response.json();
      setChartData(data);
      renderChart(data); // Render chart after fetching new data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (chartData.length > 0) {
      renderChart(chartData); // Render chart when chartData changes
    }
  }, [chartData]);

  const renderChart = (data: SalaryDataItem[]) => {
    const ctx = document.getElementById('salaryChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Destroy existing chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Render new chart instance
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.month.toString()),
        datasets: [{
          label: 'Salary',
          data: data.map(item => item.salary),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }],
      },
    });

    // Update chartRef with new instance
    chartRef.current = newChart;
  };

  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">Select a Year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </form>
      <div>
        <canvas id="salaryChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
