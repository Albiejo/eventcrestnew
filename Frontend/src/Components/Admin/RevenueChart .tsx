import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';
import { ChartConfiguration } from 'chart.js';

interface RevenueData {
  amount: number;
  createdAt: Date;
}







const RevenueChart: React.FC = () => {




  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"bar", (number | [number, number] | null)[], unknown> | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
   
    await axiosInstanceAdmin.get('/getall-payment-details').then((response) => {
        console.log(response.data.payment.result)
        setRevenueData(response.data.payment.result);
       });
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); 
    }
    renderChart();
  }, [revenueData]);




const renderChart = () => {
   
  if (!chartRef.current || !revenueData.length) return;

  const ctx = chartRef.current.getContext('2d');
  if (!ctx) return;
  
  let cumulativeBalance = 0;
  const dates = revenueData.map(data => {
    cumulativeBalance += data.amount;
    return new Date(data.createdAt).toLocaleDateString();
  });
  const walletBalances = revenueData.map(() => cumulativeBalance);

  const chartConfig: ChartConfiguration<"bar"> = {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Wallet Balance',
        data: walletBalances,
        backgroundColor: 'green',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  chartInstance.current = new Chart(ctx, chartConfig);
};
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 mt-6 ">Revenue Chart</h2>
      <canvas ref={chartRef} width={300} height={100}></canvas>
    </div>
  );
};

export default RevenueChart;
