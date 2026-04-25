/**
 * WeightChart.jsx
 * ---------------
 * Recharts area chart displaying a pet's weight history.
 * Receives the weightHistory array from the pet object.
 */
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';

/* ── Custom Tooltip ──────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="glass-card p-3 text-sm"
      style={{ minWidth: '130px', border: '1px solid rgba(20,184,166,0.25)' }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--teal-600)' }}>
        {label}
      </p>
      <p style={{ color: 'var(--text-primary)' }}>
        <span className="font-bold text-base">{payload[0].value}</span>
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>kg</span>
      </p>
    </div>
  );
}

export default function WeightChart({ data = [] }) {
  // Format dates for display
  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'MMM yy'),
  }));

  const weights = data.map((d) => d.weight);
  const avg = weights.length
    ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1)
    : 0;

  return (
    <div className="glass-card animate-fade-up delay-200 p-6" style={{ minHeight: '320px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Weight Trend
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Last {data.length} recorded entries
          </p>
        </div>
        <div
          className="pill"
          style={{ background: '#ccfbf1', color: '#0d9488' }}
        >
          avg {avg} kg
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.08)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#8ba8a4', fontFamily: 'Plus Jakarta Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#8ba8a4', fontFamily: 'Plus Jakarta Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <ReferenceLine
            y={avg}
            stroke="#f97316"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'avg', position: 'insideTopRight', fontSize: 10, fill: '#f97316' }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#14b8a6"
            strokeWidth={2.5}
            fill="url(#weightGrad)"
            dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
