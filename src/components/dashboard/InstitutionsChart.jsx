import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function InstitutionsChart({
  data,
  truncateLabels = true,
  compact = false,
  valueLabel = 'documentos',
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    return [...data]
      .filter((item) => item?.instituicao_abreviada)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const formatLabel = (text) => {
    if (!text) return '';

    if (isMobile) {
      return text.length > 10 ? `${text.slice(0, 10)}…` : text;
    }

    if (compact) {
      return text.length > 10 ? `${text.slice(0, 10)}…` : text;
    }

    if (truncateLabels) {
      return text.length > 14 ? `${text.slice(0, 14)}…` : text;
    }

    return text;
  };

  const cores = [
    '#2B73B8',
    '#5188D3',
    '#1FB885',
    '#40C99B',
    '#F2A007',
    '#F4BF26',
    '#6B5BE2',
    '#8A6AF1',
    '#22B8B0',
    '#F14668',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '10px 12px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          fontSize: '0.95rem',
          color: '#1f2937',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div>
          {value === 0 ? 's.d.' : `${value} ${valueLabel}`}
        </div>
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          color: '#6b7280',
        }}
      >
        Não há dados institucionais disponíveis.
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        height: '100%',
        minHeight: compact ? '300px' : '340px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ResponsiveContainer width="100%" height={compact ? 270 : 310}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: 13 }}
          />

          <YAxis
            dataKey="instituicao_abreviada"
            type="category"
            width={isMobile ? 88 : compact ? 88 : 110}
            tick={{ fill: '#6b7280', fontSize: compact ? 12 : 14 }}
            tickFormatter={formatLabel}
          />

         <Tooltip content={CustomTooltip} /> 

          <Bar dataKey="total" radius={[6, 6, 6, 6]}>
            {chartData.map((entry, index) => (
              <Cell
                key={entry.instituicao_abreviada}
                fill={cores[index % cores.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InstitutionsChart;