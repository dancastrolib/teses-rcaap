import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function TemporalTypeChart({ data = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '10px 12px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '6px' }}>{label}</div>

        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            style={{
              color: entry.color,
              margin: '2px 0',
              fontSize: '0.95rem',
            }}
          >
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  };

  if (!data.length) {
    return (
      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          minHeight: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
        }}
      >
        Não há dados temporais disponíveis.
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
      }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          <XAxis
            dataKey="ano"
            tick={{ fill: '#6b7280', fontSize: 13 }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: 13 }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '12px' }} />

          <Line
            type="monotone"
            dataKey="doutoramentos"
            name="Doutoramento"
            stroke="#F59E0B"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="mestrados"
            name="Mestrado"
            stroke="#1E6FB9"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="total"
            name="Total"
            stroke="#8B5CF6"
            strokeWidth={2.8}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            strokeDasharray="5 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TemporalTypeChart;