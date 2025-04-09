import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import { API_URL } from '../../config';

const ChartDashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [resolutionTime, setResolutionTime] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF'];
  const STATUS_COLORS = {
    PENDING: '#FFBB28',
    IN_PROGRESS: '#0088FE',
    RESOLVED: '#00C49F',
    CLOSED: '#8884d8'
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch all chart data in parallel
        const [statsRes, trendsRes, resolutionRes, staffRes] = await Promise.all([
          axios.get(`${API_URL}/api/charts/stats`),
          axios.get(`${API_URL}/api/charts/monthly-trends`),
          axios.get(`${API_URL}/api/charts/resolution-time`),
          axios.get(`${API_URL}/api/charts/staff-performance`)
        ]);
        
        setStats(statsRes.data);
        setMonthlyTrends(trendsRes.data);
        setResolutionTime(resolutionRes.data);
        setStaffPerformance(staffRes.data);
        
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Complaints Analytics Dashboard</h1>
      
      {/* Status summary cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-700">Total Complaints</h3>
            <p className="text-2xl font-bold">{stats.totalComplaints}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-700">Resolution Rate</h3>
            <p className="text-2xl font-bold">{stats.resolutionRate}%</p>
          </div>
          
          {resolutionTime && (
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-700">Avg. Resolution Time</h3>
              <p className="text-2xl font-bold">{resolutionTime.averageResolutionDays} days</p>
            </div>
          )}
          
          <div className="bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Resolved</span>
            <div className="w-3 h-3 rounded-full bg-blue-500 mx-2"></div>
            <span className="text-sm">In Progress</span>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mx-2"></div>
            <span className="text-sm">Pending</span>
          </div>
        </div>
      )}
      
      {/* First row of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution Chart */}
        {stats && (
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Complaint Status Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Age Distribution Chart */}
        {stats && (
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Complaint Age Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.ageDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Complaints" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Monthly Trends Chart */}
      {monthlyTrends.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Complaint Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#FFBB28" />
                <Line type="monotone" dataKey="inProgress" name="In Progress" stroke="#0088FE" />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#00C49F" />
                <Line type="monotone" dataKey="closed" name="Closed" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Second row of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resolution Time Distribution */}
        {resolutionTime && (
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Resolution Time Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resolutionTime.resolutionTimeDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeFrame" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Number of Complaints" 
                    fill="#00C49F" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Staff Performance */}
        {staffPerformance.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Staff Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staffPerformance.slice(0, 5)} // Show top 5 staff members
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="staffName" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#00C49F" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDashboard;