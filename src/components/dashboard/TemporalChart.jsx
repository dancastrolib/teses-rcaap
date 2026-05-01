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

function CustomTooltip({ active, payload, label, tooltipDetails = [] }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload || {};

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}
    >
      <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{label}</p>

      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{
            margin: '4px 0',
            color: entry.color,
            fontSize: '0.95rem',
          }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}

      {tooltipDetails.length > 0 && (
        <div
          style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          {tooltipDetails
            .filter((detail) => (point[detail.dataKey] ?? 0) > 0)
            .map((detail) => (
              <p
                key={detail.dataKey}
                style={{
                  margin: '3px 0',
                  fontSize: '0.9rem',
                  color: '#4b5563',
                }}
              >
                {detail.name}: {point[detail.dataKey] ?? 0}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

function TemporalChart({
  data,
  lines = [{ dataKey: 'total', name: 'Total', stroke: '#1E6FB9' }],
  height = 300,
  showLegend = true,
  tooltipDetails = [],
}) {
  const isMobile = window.innerWidth < 768;

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          color: '#6b7280',
          minHeight: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        padding: isMobile ? '10px' : '16px',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <ResponsiveContainer width="100%" height={isMobile ? 260 : height}>
        <LineChart
          data={data}
          margin={
            isMobile
              ? { top: 12, right: 8, left: -22, bottom: 4 }
              : { top: 8, right: 16, left: 0, bottom: 8 }
          }
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          <XAxis
            dataKey="ano"
            tick={{ fill: '#6b7280', fontSize: isMobile ? 11 : 13 }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: isMobile ? 11 : 13 }}
          />

          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} tooltipDetails={tooltipDetails} />
            )}
          />

          {showLegend && <Legend wrapperStyle={{ paddingTop: '12px' }} />}

          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth || 2.5}
              dot={line.dot || { r: 4 }}
              activeDot={line.activeDot || { r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TemporalChart;