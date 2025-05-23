import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
  // Mock Data - In a real application, this would come from an API
  const mockOverallHealth = {
    totalNotificationsSent: 125000,
    successfulDeliveries: { count: 118000, percentage: 94.4 },
    failedDeliveries: { count: 7000, percentage: 5.6, reasons: { dnd: 2000, invalid: 3000, bounce: 1500, optOut: 500 } },
    avgTimeToTrigger: '2.5 sec',
    avgTimeToDelivery: '15 sec',
    customerReachRate: 92.8,
  };

  const mockChannelMetrics = [
    { channel: 'WhatsApp', sent: 50000, delivered: 48000, openRate: '85%', ctr: '35%', bounceRate: '0%', optOutRate: '0.1%', avgDeliveryTime: '5 sec' },
    { channel: 'SMS', sent: 40000, delivered: 36000, openRate: 'N/A', ctr: 'N/A', bounceRate: '5%', optOutRate: '0.5%', avgDeliveryTime: '10 sec' },
    { channel: 'Email', sent: 25000, delivered: 23000, openRate: '30%', ctr: '5%', bounceRate: '8%', optOutRate: '0.2%', avgDeliveryTime: '30 sec' },
    { channel: 'Push', sent: 8000, delivered: 7500, openRate: '45%', ctr: '10%', bounceRate: 'N/A', optOutRate: 'N/A', avgDeliveryTime: '2 sec' },
    { channel: 'In-App', sent: 2000, delivered: 2000, openRate: 'View %', ctr: 'Tap %', bounceRate: 'N/A', optOutRate: 'N/A', avgDeliveryTime: 'N/A' },
  ];

  const mockEventMetrics = [
    { eventType: 'Order Confirmed', sent: 10000, delivered: 9800, openRate: '80%', avgDelay: '1 sec', failedPercentage: '2%', ctr: '25%' },
    { eventType: 'Order Shipped', sent: 9800, delivered: 9500, openRate: '75%', avgDelay: '2 sec', failedPercentage: '3%', ctr: '30%' },
    { eventType: 'Out for Delivery', sent: 9500, delivered: 9000, openRate: '70%', avgDelay: '3 sec', failedPercentage: '5%', ctr: '28%' },
    { eventType: 'Delivered', sent: 9000, delivered: 8500, openRate: '60%', avgDelay: '1 sec', failedPercentage: '5%', ctr: '20%' },
    { eventType: 'Return Initiated', sent: 1000, delivered: 950, openRate: '50%', avgDelay: '2 sec', failedPercentage: '5%', ctr: '15%' },
    { eventType: 'Return Pickup Scheduled', sent: 900, delivered: 850, openRate: '48%', avgDelay: '2 sec', failedPercentage: '6%', ctr: '14%' },
    { eventType: 'Refund Initiated', sent: 800, delivered: 750, openRate: '40%', avgDelay: '1 sec', failedPercentage: '6%', ctr: '10%' },
    { eventType: 'Refund Credited', sent: 700, delivered: 650, openRate: '35%', avgDelay: '1 sec', failedPercentage: '7%', ctr: '8%' },
  ];

  const mockFunnelData = [
    { stage: 'Order Placed', percentage: 100, flag: false },
    { stage: 'Order Confirmed', percentage: 98, flag: false },
    { stage: 'Shipped', percentage: 97, flag: false },
    { stage: 'Out for Delivery', percentage: 80, flag: true, insight: 'Only 80% of Out for Delivery messages sent - abnormal drop!' },
    { stage: 'Delivered', percentage: 90, flag: false },
  ];

  const mockCustomerEngagement = [
    { metric: '% Orders with No Notification View', insight: '12% of users didn’t see any shipment update' },
    { metric: '% Customers Who Clicked Notification', insight: 'Tap rates on delivery messages, return help, refund status' },
    { metric: '% Who Initiated Return via Notification', insight: 'Tracks how effective return message is at driving self-serve' },
    { metric: 'ITU (Interaction-to-Unit) vs Notification Health', insight: 'Cross-plot high ITU orders with low notification delivery' },
  ];

  const mockErrors = [
    { errorType: 'SMS Failed – DND', count: 2000, channel: 'SMS', lastOccurrence: '2025-05-22 14:30' },
    { errorType: 'Email Bounce – Invalid ID', count: 1500, channel: 'Email', lastOccurrence: '2025-05-22 10:00' },
    { errorType: 'WhatsApp Not Opted-in', count: 500, channel: 'WhatsApp', lastOccurrence: '2025-05-21 18:00' },
    { errorType: 'Trigger Delay > SLA', count: 300, channel: 'All', lastOccurrence: '2025-05-22 09:15' },
    { errorType: 'Duplicate Message Sent', count: 50, channel: 'All', lastOccurrence: '2025-05-20 11:00' },
  ];

  const mockABTests = [
    { testName: 'Refund Template 1', channel: 'Email', event: 'Refund Initiated', variantACTR: '12%', variantBCTR: '22%', winner: 'B' },
    { testName: 'Delivery OTP Channel', channel: 'SMS/WhatsApp', event: 'Out for Delivery', variantACTR: '80%', variantBCTR: '90%', winner: 'B' },
  ];

  const mockRecommendations = [
    'Refund notification via Email has <10% open rate – recommend switching to WhatsApp for this.',
    'Delivery OTP SMS failure spikes seen for prepaid orders – investigate.',
    'Consider A/B testing push notification copy for "Order Shipped" event to improve CTR.',
  ];

  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [channelFilter, setChannelFilter] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [devicePlatform, setDevicePlatform] = useState('All');
  const [demographics, setDemographics] = useState('All');
  const [orderValueTier, setOrderValueTier] = useState('All');

  // Filtered data (simple filtering for demonstration)
  const filteredChannelMetrics = channelFilter === 'All'
    ? mockChannelMetrics
    : mockChannelMetrics.filter(m => m.channel === channelFilter);

  const filteredEventMetrics = eventTypeFilter === 'All' && channelFilter === 'All'
    ? mockEventMetrics
    : mockEventMetrics.filter(m =>
        (eventTypeFilter === 'All' || m.eventType === eventTypeFilter) &&
        (channelFilter === 'All' || mockChannelMetrics.some(c => c.channel === channelFilter && c.channel === m.channel)) // This part is a bit tricky with mock data, assuming event metrics are not tied to specific channels in this simple mock
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 font-sans text-gray-800">
      {/* Header */}
       <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 tracking-tight leading-tight">
          <span className="block text-blue-600 text-3xl mb-1">Myntra Outbound</span>
          Post-Order Notification Health Dashboard
        </h1>
        <p className="text-xl text-gray-600 mt-2">Monitor and optimize your customer communication</p>
      </header>


      {/* Filters Panel */}
      <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Refine Your View</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="dateRange"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label htmlFor="channelFilter" className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
            <select
              id="channelFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option>All</option>
              <option>WhatsApp</option>
              <option>SMS</option>
              <option>Email</option>
              <option>Push</option>
              <option>In-App</option>
            </select>
          </div>
          <div>
            <label htmlFor="eventTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              id="eventTypeFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Order Confirmed</option>
              <option>Order Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Return Initiated</option>
              <option>Return Pickup Scheduled</option>
              <option>Refund Initiated</option>
              <option>Refund Credited</option>
            </select>
          </div>
          <div>
            <label htmlFor="devicePlatform" className="block text-sm font-medium text-gray-700 mb-1">Device/Platform</label>
            <select
              id="devicePlatform"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={devicePlatform}
              onChange={(e) => setDevicePlatform(e.target.value)}
            >
              <option>All</option>
              <option>Android</option>
              <option>iOS</option>
              <option>Web</option>
            </select>
          </div>
          <div>
            <label htmlFor="demographics" className="block text-sm font-medium text-gray-700 mb-1">Demographics</label>
            <select
              id="demographics"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={demographics}
              onChange={(e) => setDemographics(e.target.value)}
            >
              <option>All</option>
              <option>Age 18-24</option>
              <option>Age 25-34</option>
              <option>Age 35-44</option>
            </select>
          </div>
          <div>
            <label htmlFor="orderValueTier" className="block text-sm font-medium text-gray-700 mb-1">Order Value Tier</label>
            <select
              id="orderValueTier"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              value={orderValueTier}
              onChange={(e) => setOrderValueTier(e.target.value)}
            >
              <option>All</option>
              <option>High-value</option>
              <option>Low-value</option>
            </select>
          </div>
        </div>
      </section>

      {/* Overall Notification Health Summary */}
      <OverallHealthSummary data={mockOverallHealth} />

      {/* Channel-Wise Metrics */}
      <ChannelMetrics data={filteredChannelMetrics} />

      {/* Event-wise Notification Metrics */}
      <EventMetrics data={filteredEventMetrics} />

      {/* Funnel View */}
      <FunnelView data={mockFunnelData} />

      {/* Customer Engagement Metrics */}
      <CustomerEngagement data={mockCustomerEngagement} />

      {/* Errors and Exceptions Monitor */}
      <ErrorsMonitor data={mockErrors} />

      {/* A/B Test Panel */}
      <ABTestPanel data={mockABTests} />

      {/* Recommendations & Anomalies */}
      <Recommendations recommendations={mockRecommendations} />
    </div>
  );
};

// Component for Overall Notification Health Summary
const OverallHealthSummary = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-green-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Overall Notification Health Summary</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <MetricCard title="Total Notifications Sent" value={data.totalNotificationsSent.toLocaleString()} color="blue" />
      <MetricCard title="Successful Deliveries" value={`${data.successfulDeliveries.count.toLocaleString()} (${data.successfulDeliveries.percentage}%)`} color="green" />
      <MetricCard title="Failed Deliveries" value={`${data.failedDeliveries.count.toLocaleString()} (${data.failedDeliveries.percentage}%)`} color="red" />
      <MetricCard title="Avg. Time to Trigger" value={data.avgTimeToTrigger} color="purple" />
      <MetricCard title="Avg. Time to Delivery" value={data.avgTimeToDelivery} color="orange" />
      <MetricCard title="Customer Reach Rate" value={`${data.customerReachRate}%`} color="teal" />
    </div>
  </section>
);

// Reusable Metric Card Component
const MetricCard = ({ title, value, color }) => {
  const bgColor = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    teal: 'bg-teal-50',
  }[color];

  const textColor = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    red: 'text-red-800',
    purple: 'text-purple-800',
    orange: 'text-orange-800',
    teal: 'text-teal-800',
  }[color];

  const borderColor = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    red: 'border-red-200',
    purple: 'border-purple-200',
    orange: 'border-orange-200',
    teal: 'border-teal-200',
  }[color];

  const valueColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    teal: 'text-teal-600',
  }[color];


  return (
    <div className={`${bgColor} p-5 rounded-xl shadow-md border ${borderColor} flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`}>
      <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
      <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
    </div>
  );
};

const ChannelMetrics = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-purple-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Channel-Wise Performance</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Channel</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Sent</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Delivered</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Open Rate</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">CTR</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Bounce Rate</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Opt-out Rate</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Avg. Delivery Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.channel} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{row.channel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.sent.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.delivered.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.openRate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.ctr}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.bounceRate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.optOutRate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.avgDeliveryTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-sm text-gray-600 mt-6 italic">Note: Trend views for these KPIs would typically be displayed using interactive line charts over time for deeper analysis.</p>
  </section>
);

// Component for Event-wise Notification Metrics
const EventMetrics = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-teal-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Event-Wise Notification Metrics</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Event Type</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Sent</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Delivered</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Open Rate</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Avg. Delay</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Failed %</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">CTR</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.eventType} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{row.eventType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.sent.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.delivered.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.openRate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.avgDelay}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.failedPercentage}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.ctr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// Component for Funnel View
const FunnelView = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-orange-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Funnel View: Order Journey vs Notification Delivery</h2>
    <div className="flex flex-col items-center space-y-5 py-4">
      {data.map((stage, index) => (
        <React.Fragment key={stage.stage}>
          <div className="flex items-center w-full max-w-2xl px-4">
            <div className={`flex-grow text-right pr-6 text-lg font-medium ${stage.flag ? 'text-red-600' : 'text-gray-800'}`}>
              {stage.stage} {stage.percentage < 100 ? `(${stage.percentage}% sent)` : ''}
            </div>
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-xl shadow-lg
              ${stage.flag ? 'bg-red-500 ring-4 ring-red-200' : 'bg-blue-500 ring-4 ring-blue-200'}`}>
              {index + 1}
            </div>
            <div className="flex-grow text-left pl-6">
              {stage.flag && (
                <span className="text-red-500 text-sm font-semibold flex items-center bg-red-50 px-3 py-1 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.345a.75.75 0 011.486 0l3.085 6.17a.75.75 0 01-.154.787l-3.085 3.085a.75.75 0 01-1.06 0l-3.085-3.085a.75.75 0 01-.154-.787l3.085-6.17z" clipRule="evenodd" />
                  </svg>
                  {stage.insight}
                </span>
              )}
            </div>
          </div>
          {index < data.length - 1 && (
            <div className={`w-1 h-12 ${data[index].flag ? 'bg-red-300' : 'bg-gray-300'} rounded-full`}></div>
          )}
        </React.Fragment>
      ))}
      <div className="text-blue-600 font-semibold text-lg mt-4 px-4 py-2 bg-blue-50 rounded-lg shadow-inner">
        (Example: Click Rate for Shipped stage: 30%)
      </div>
    </div>
  </section>
);

// Component for Customer Engagement Metrics
const CustomerEngagement = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-pink-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Customer Engagement Insights</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Metric</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Key Insight</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.metric} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{row.metric}</td>
              <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700">{row.insight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// Component for Errors and Exceptions Monitor
const ErrorsMonitor = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-red-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Errors and Exceptions Monitor</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-red-500 to-rose-700 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Error Type</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Count</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Channel</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Last Occurrence</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.errorType} className="hover:bg-red-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-red-700">{row.errorType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.count.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.channel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.lastOccurrence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// Component for A/B Test Panel
const ABTestPanel = ({ data }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-yellow-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">A/B Test Performance</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Test Name</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Channel</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Event</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Variant A CTR</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Variant B CTR</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Winner</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.testName} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{row.testName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.channel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.event}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.variantACTR}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.variantBCTR}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{row.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// Component for Recommendations & Anomalies
const Recommendations = ({ recommendations }) => (
  <section className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-green-100">
    <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-3 border-gray-200">Recommendations & Actionable Insights</h2>
    <ul className="list-none space-y-4 text-gray-700">
      {recommendations.map((rec, index) => (
        <li key={index} className="flex items-start bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-100 transition duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-base leading-relaxed">{rec}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default App;