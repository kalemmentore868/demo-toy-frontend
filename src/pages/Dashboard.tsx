// src/pages/Dashboard.tsx
"use client";

import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboard } from "@/hooks/useDashboard";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage message={error.message} />;

  const lineColor = "rgba(75, 192, 192, 1)";
  const lineBg = "rgba(75, 192, 192, 0.2)";
  const barColor = "rgba(255, 99, 132, 0.5)";
  const barBorder = "rgba(255, 99, 132, 1)";
  const pieColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  // prepare chart datasets
  const ordersByDayChart = {
    labels: data!.ordersByDay.map((o) => o.day),
    datasets: [
      {
        label: "Orders",
        data: data!.ordersByDay.map((o) => o.count),
        borderColor: lineColor,
        backgroundColor: lineBg,
        tension: 0.4,
      },
    ],
  };

  const locationChart = {
    labels: data!.locationData.map((l) => l.country),
    datasets: [
      {
        label: "Orders by Country",
        data: data!.locationData.map((l) => l.count),
        backgroundColor: barColor,
        borderColor: barBorder,
        borderWidth: 1,
      },
    ],
  };

  const categoryChart = {
    labels: data!.typeDistribution.map((d) => d.category),
    datasets: [
      {
        label: "Items Sold by Category",
        data: data!.typeDistribution.map((d) => d.count),
        backgroundColor: pieColors.slice(0, data!.typeDistribution.length),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Total Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data!.totalCustomers}</div>
          </CardContent>
        </Card>

        {/* Orders Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Orders (Last Year)</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={ordersByDayChart} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders by Country */}
          <Card>
            <CardHeader>
              <CardTitle>Orders by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={locationChart} />
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={categoryChart} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
