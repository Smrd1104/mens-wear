import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);

   const fetchStats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/dashboard/stats?page=${page}`, {
        headers: { token }
      });
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [page]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  if (!stats) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: stats.summary.totalOrders },
          { label: "Total Revenue", value: `₹${stats.summary.totalRevenue}` },
          { label: "Users", value: stats.summary.totalUsers },
          { label: "Products", value: stats.summary.totalProducts },
        ].map((item) => (
          <div key={item.label} className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">All Orders</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Order ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {stats.allOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{order._id}</td>
                <td>{order.userId?.name || "Guest"}</td>
                <td>₹{order.amount}</td>
                <td>{order.status}</td>
                <td>{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm">
            Page {stats.currentPage} of {stats.totalPages}
          </p>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, stats.totalPages))}
            disabled={page === stats.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.paymentBreakdown}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.paymentBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.statusStats}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">All Selling Products</h2>
        <ul className="list-disc pl-6 space-y-1">
          {stats.allProductSales.map((item) => (
            <li key={item._id}>{item._id} - {item.totalSold} sold</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
