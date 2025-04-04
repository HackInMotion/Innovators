import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StudentActivityTracker = () => {
  const [timeRange, setTimeRange] = useState("weekly"); // 'daily', 'weekly', 'monthly'
  const chartRefs = {
    engagement: useRef(null),
    timeDistribution: useRef(null),
    activityHeatmap: useRef(null),
  };
  const chartInstances = useRef({});

  // Enhanced sample data with monthly data
  const activityData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      engagement: [70, 75, 82, 68, 72, 65, 60],
      timeSpent: [90, 120, 150, 80, 110, 70, 50],
      assignments: [1, 2, 1, 0, 2, 0, 0],
      forumPosts: [1, 2, 3, 1, 2, 0, 0],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      engagement: [65, 72, 80, 68],
      timeSpent: [420, 580, 650, 530],
      assignments: [3, 5, 4, 6],
      forumPosts: [2, 4, 5, 3],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      engagement: [68, 72, 75, 70, 78, 82],
      timeSpent: [1800, 2100, 2400, 1950, 2550, 2700],
      assignments: [12, 14, 16, 13, 18, 20],
      forumPosts: [8, 10, 12, 9, 14, 15],
    },
  };

  const timeDistributionData = {
    categories: ["Lectures", "Assignments", "Quizzes", "Forum", "Reading"],
    time: [35, 25, 15, 10, 15], // Percentage
  };

  // Enhanced heatmap data for different time ranges
  const heatmapData = {
    daily: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours: Array(24)
        .fill()
        .map((_, i) => i),
      activity: Array(5)
        .fill()
        .map(() =>
          Array(24)
            .fill()
            .map(() => Math.floor(Math.random() * 10))
        ),
    },
    weekly: {
      days: ["Week 1", "Week 2", "Week 3", "Week 4"],
      hours: ["Morning", "Afternoon", "Evening", "Night"],
      activity: Array(4)
        .fill()
        .map(() =>
          Array(4)
            .fill()
            .map(() => Math.floor(Math.random() * 10))
        ),
    },
    monthly: {
      days: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      hours: ["1st Week", "2nd Week", "3rd Week", "4th Week"],
      activity: Array(6)
        .fill()
        .map(() =>
          Array(4)
            .fill()
            .map(() => Math.floor(Math.random() * 10))
        ),
    },
  };

  useEffect(() => {
    renderEngagementChart();
    renderTimeDistributionChart();
    renderActivityHeatmap();

    return () => {
      Object.values(chartInstances.current).forEach((instance) => {
        if (instance) instance.destroy();
      });
    };
  }, [timeRange]);

  const renderEngagementChart = () => {
    const ctx = chartRefs.engagement.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstances.current.engagement) {
      chartInstances.current.engagement.destroy();
    }

    chartInstances.current.engagement = new Chart(ctx, {
      type: "line",
      data: {
        labels: activityData[timeRange].labels,
        datasets: [
          {
            label: "Engagement Score",
            data: activityData[timeRange].engagement,
            borderColor: "rgba(99, 102, 241, 1)",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            tension: 0.3,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Time Spent (min)",
            data: activityData[timeRange].timeSpent,
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.3,
            fill: true,
            yAxisID: "y1",
          },
        ],
      },
      options: getEngagementChartOptions(),
    });
  };

  const renderTimeDistributionChart = () => {
    const ctx = chartRefs.timeDistribution.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstances.current.timeDistribution) {
      chartInstances.current.timeDistribution.destroy();
    }

    chartInstances.current.timeDistribution = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: timeDistributionData.categories,
        datasets: [
          {
            data: timeDistributionData.time,
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(244, 63, 94, 0.7)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}%`;
              },
            },
          },
        },
        cutout: "70%",
      },
    });
  };

  const renderActivityHeatmap = () => {
    const ctx = chartRefs.activityHeatmap.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstances.current.activityHeatmap) {
      chartInstances.current.activityHeatmap.destroy();
    }

    const data = heatmapData[timeRange];

    chartInstances.current.activityHeatmap = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.hours,
        datasets: data.days.map((day, i) => ({
          label: day,
          data: data.activity[i],
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        })),
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text:
                timeRange === "daily"
                  ? "Time of Day"
                  : timeRange === "weekly"
                  ? "Time of Week"
                  : "Week of Month",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Activity Level",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `${
              timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
            } Activity Heatmap`,
            font: {
              size: 16,
            },
          },
        },
      },
    });
  };

  const getEngagementChartOptions = () => ({
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Student Engagement (${timeRange})`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.dataset.yAxisID === "y1") {
              label += `${context.raw} minutes`;
            } else {
              label += context.raw;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Engagement Score",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Time Spent (minutes)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  });

  // Update metrics based on time range
  const getMetrics = () => {
    const data = activityData[timeRange];
    const avgEngagement = (
      data.engagement.reduce((a, b) => a + b, 0) / data.engagement.length
    ).toFixed(0);
    const totalTime = data.timeSpent.reduce((a, b) => a + b, 0);
    const totalAssignments = data.assignments.reduce((a, b) => a + b, 0);

    return [
      {
        title: "Avg Engagement",
        value: `${avgEngagement}%`,
        change:
          timeRange === "daily"
            ? "+5%"
            : timeRange === "weekly"
            ? "+8%"
            : "+12%",
        trend: "up",
      },
      {
        title: "Total Time",
        value:
          timeRange === "daily"
            ? `${totalTime} min`
            : timeRange === "weekly"
            ? `${(totalTime / 60).toFixed(1)}h`
            : `${(totalTime / 60).toFixed(1)}h`,
        change:
          timeRange === "daily"
            ? "+30min"
            : timeRange === "weekly"
            ? "+3.2h"
            : "+8.5h",
        trend: "up",
      },
      {
        title: "Assignments",
        value: totalAssignments,
        change:
          timeRange === "daily" ? "+1" : timeRange === "weekly" ? "+4" : "+8",
        trend: "up",
      },
    ];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Student Activity Tracker
      </h1>

      {/* Time Range Selector */}
      <div className="flex space-x-2 mb-6">
        {["daily", "weekly", "monthly"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md ${
              timeRange === range
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {getMetrics().map((metric, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">{metric.title}</p>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
            <p
              className={`text-sm mt-1 ${
                metric.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {metric.change} from last period
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Engagement Chart */}
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <div className="h-80">
            <canvas ref={chartRefs.engagement} />
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Time Distribution</h3>
          <div className="h-80">
            <canvas ref={chartRefs.timeDistribution} />
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-4">
          {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Activity
          Heatmap
        </h3>
        <div className="h-96">
          <canvas ref={chartRefs.activityHeatmap} />
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  date: "2023-05-15",
                  activity: "Watched Lecture 5.2",
                  duration: "45 min",
                  course: "Mathematics",
                },
                {
                  date: "2023-05-14",
                  activity: "Submitted Assignment 3",
                  duration: "60 min",
                  course: "Science",
                },
                {
                  date: "2023-05-13",
                  activity: "Participated in Forum",
                  duration: "25 min",
                  course: "Literature",
                },
                {
                  date: "2023-05-12",
                  activity: "Completed Quiz 2",
                  duration: "30 min",
                  course: "History",
                },
                {
                  date: "2023-05-11",
                  activity: "Reviewed Materials",
                  duration: "40 min",
                  course: "Mathematics",
                },
              ].map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.activity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.course}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentActivityTracker;
