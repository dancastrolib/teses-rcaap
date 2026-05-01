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

function darkenHex(hex, amount = 0.22) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);

  const r = Math.max(0, Math.floor(((num >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 255) * (1 - amount)));

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

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
        maxWidth: '280px',
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: '6px' }}>{item.subject}</div>
      <div>Total: {item.total}</div>
      <div>Mestrado: {item.mestrado}</div>
      <div>Doutoramento: {item.doutoramento}</div>
    </div>
  );
}

const cores = [
  '#1E6FB9',
  '#4F8EDC',
  '#10B981',
  '#34D399',
  '#F59E0B',
  '#FBBF24',
  '#6366F1',
  '#8B5CF6'
];

function ThemeDistributionChart({ data, truncateLabels = true, compact = false }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    const temas = {};

    data.forEach((item) => {
      const subject =
        item.subject_label?.trim() ||
        item.descritor_primario_label?.trim() ||
        item.subject?.trim();

      if (!subject) return;

      if (!temas[subject]) {
        temas[subject] = {
          subject,
          label: subject,
          mestrado: 0,
          doutoramento: 0,
          total: 0,
        };
      }

      const tipo = String(item.tipo || '').toLowerCase();

      if (tipo === 'doctoral thesis') {
        temas[subject].doutoramento += 1;
      } else {
        temas[subject].mestrado += 1;
      }

      temas[subject].total += 1;
    });

    return Object.values(temas)
      .sort((a, b) => b.total - a.total)
      .map((item, index) => {
        const baseColor = cores[index % cores.length];

        return {
          ...item,
          baseColor,
          darkColor: darkenHex(baseColor, 0.24),
        };
      });
}, [data]);

  const formatLabel = (text) => {
    if (!text) return '';

    if (isMobile) return text.length > 18 ? `${text.slice(0, 18)}…` : text;
    if (compact) return text.length > 18 ? `${text.slice(0, 18)}…` : text;
    if (truncateLabels) return text.length > 26 ? `${text.slice(0, 26)}…` : text;

    return text;
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
        Não há dados temáticos disponíveis.
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
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ResponsiveContainer width="100%" height={compact ? 340 : 440}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: 13 }}
          />

          <YAxis
            dataKey="label"
            type="category"
            width={isMobile ? 165 : compact ? 180 : 300}
            tick={{ fill: '#6b7280', fontSize: compact ? 12 : 14 }}
            tickFormatter={formatLabel}
          />

          <Tooltip content={CustomTooltip} />

          <Bar dataKey="mestrado" stackId="tema" radius={[6, 0, 0, 6]}>
            {chartData.map((entry) => (
              <Cell key={`${entry.subject}-m`} fill={entry.baseColor} />
            ))}
          </Bar>

          <Bar dataKey="doutoramento" stackId="tema" radius={[0, 6, 6, 0]}>
            {chartData.map((entry) => (
              <Cell key={`${entry.subject}-d`} fill={entry.darkColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThemeDistributionChart;