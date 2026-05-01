import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function TypePieChart({ data = [] }) {
  const totalDissertacoesPT = data.filter(
    (d) =>
      d.tipo?.trim().toLowerCase() === 'master thesis' &&
      d.idioma?.trim().toLowerCase() === 'por'
  ).length;

  const totalDissertacoesEN = data.filter(
    (d) =>
      d.tipo?.trim().toLowerCase() === 'master thesis' &&
      d.idioma?.trim().toLowerCase() === 'eng'
  ).length;

  const totalTesesPT = data.filter(
    (d) =>
      d.tipo?.trim().toLowerCase() === 'doctoral thesis' &&
      d.idioma?.trim().toLowerCase() === 'por'
  ).length;

  const totalTesesEN = data.filter(
    (d) =>
      d.tipo?.trim().toLowerCase() === 'doctoral thesis' &&
      d.idioma?.trim().toLowerCase() === 'eng'
  ).length;

  const total =
    totalDissertacoesPT +
    totalDissertacoesEN +
    totalTesesPT +
    totalTesesEN;

  const chartData = [
    {
      key: 'dissertacoes-pt',
      name: 'Dissertações (pt)',
      value: totalDissertacoesPT,
      color: '#1E6FB9',
      group: 'dissertacoes',
    },
    {
      key: 'dissertacoes-en',
      name: 'Dissertações (en)',
      value: totalDissertacoesEN,
      color: '#60A5FA',
      group: 'dissertacoes',
    },
    {
      key: 'teses-pt',
      name: 'Teses (pt)',
      value: totalTesesPT,
      color: '#F59E0B',
      group: 'teses',
    },
    {
      key: 'teses-en',
      name: 'Teses (en)',
      value: totalTesesEN,
      color: '#FCD34D',
      group: 'teses',
    },
  ]
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      percentLabel: total ? Math.round((item.value / total) * 100) : 0,
    }));

  const legendaDissertacoes = chartData.filter(
    (item) => item.group === 'dissertacoes'
  );

  const legendaTeses = chartData.filter(
    (item) => item.group === 'teses'
  );

  const CustomTooltip = ({ active, payload }) => {
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
        }}
      >
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div>{item.value} documentos</div>
        <div>{item.percentLabel}%</div>
      </div>
    );
  };

  const renderLegendItem = (item) => (
    <div
      key={item.key}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.9rem',
        color: '#4b5563',
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '3px',
          background: item.color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span>{item.name}</span>
    </div>
  );

  if (!chartData.length) {
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
        Não há dados disponíveis.
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
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="46%"
              innerRadius={62}
              outerRadius={98}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
              startAngle={18}
              endAngle={378}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
              labelLine
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip content={CustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          marginTop: '8px',
          paddingTop: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 18px',
          }}
        >
          {legendaDissertacoes.map(renderLegendItem)}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 18px',
          }}
        >
          {legendaTeses.map(renderLegendItem)}
        </div>
      </div>
    </div>
  );
}

export default TypePieChart;
