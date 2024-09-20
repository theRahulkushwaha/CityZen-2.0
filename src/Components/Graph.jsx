import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Graph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch accident statistics from the backend
    fetch('http://localhost:5000/statistics')
      .then((response) => response.json())
      .then((statistics) => {
        // Format data for Recharts
        const formattedData = [
          { name: 'Car-Car Accident', count: statistics.car_car_accident },
          { name: 'Injured', count: statistics.injured },
          { name: 'Car-Person Accident', count: statistics.car_person_accident }
        ];
        setData(formattedData);
      })
      .catch((error) => console.error('Error fetching statistics:', error));
  }, []);

  return (
    <ResponsiveContainer width="85%" height={210}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Graph;
