import { useEffect, useMemo, useState } from 'react';
import StatCard from './StatCard';
import TypePieChart from './TypePieChart';
import TemporalTypeChart from './TemporalTypeChart';
import ThemeDistributionChart from './ThemeDistributionChart';
import ThematicTimeline from "./ThematicTimeline";
import SupervisorThemeNetwork from './SupervisorThemeNetwork';
import KeywordCloud from './KeywordCloud';
import KeywordResultsView from './KeywordResultsView';

function DashboardView({ data, setView, setSelectedItem, setDetailOrigin }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [temaSelecionado, setTemaSelecionado] = useState('todos');
  const [keywordSelecionada, setKeywordSelecionada] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const getTema = (item) => {
      return (
        item.subject_label?.trim() ||
        item.descritor_primario_label?.trim() ||
        item.subject?.trim() ||
        ''
      );
    };


  const isMestrado = (item) =>
    item.tipo?.trim().toLowerCase() === 'master thesis';

  const isDoutoramento = (item) =>
    item.tipo?.trim().toLowerCase() === 'doctoral thesis';

  const temasUnicos = useMemo(() => {
    return [...new Set(data.map((item) => getTema(item)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [data]);

  const temporalData = useMemo(() => {
    const anos = [...new Set(data.map((d) => Number(d.ano)))]
      .filter((ano) => !Number.isNaN(ano) && ano)
      .sort((a, b) => a - b);

    return anos.map((ano) => {
      const itemsAno = data.filter((d) => Number(d.ano) === ano);

      return {
        ano: String(ano),
        total: itemsAno.length,
        mestrados: itemsAno.filter((d) => isMestrado(d)).length,
        doutoramentos: itemsAno.filter((d) => isDoutoramento(d)).length,
      };
    });
  }, [data]);

  const totalMestrados = useMemo(
    () => data.filter((d) => isMestrado(d)).length,
    [data]
  );

  const totalDoutoramentos = useMemo(
    () => data.filter((d) => isDoutoramento(d)).length,
    [data]
  );

    const keywordsPorTema = useMemo(() => {
    const mapa = {};

    data
      .filter((item) => {
        const temaItem = getTema(item);
        return temaSelecionado === 'todos' ? true : temaItem === temaSelecionado;
      })
      .forEach((item) => {
        if (!item.palavra_chave) return;

        item.palavra_chave
          .split(/[,;]+/)
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean)
          .forEach((k) => {
            mapa[k] = (mapa[k] || 0) + 1;
          });
      });

      const EXCLUDE = [
        "humanidades digitais",
        "digital humanities",
      ];

      return Object.entries(mapa)
        .map(([keyword, count]) => ({
          keyword: keyword.toLowerCase(),
          count,
        }))
        .filter((item) => !EXCLUDE.includes(item.keyword))
        .sort((a, b) => b.count - a.count)
        .slice(0, 40);
  }, [data, temaSelecionado]);

  const resultadosKeyword = useMemo(() => {
    if (!keywordSelecionada) return [];

    return data.filter((item) => {
      const temaItem = getTema(item);
      const matchTema =
        temaSelecionado === 'todos' ? true : temaItem === temaSelecionado;

      if (!matchTema || !item.palavra_chave) return false;

      const lista = item.palavra_chave
        .split(/[,;]+/)
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      return lista.includes(keywordSelecionada);
    });
  }, [data, keywordSelecionada, temaSelecionado]);

  if (keywordSelecionada) {
    return (
      <main
        className="container"
        style={{
          paddingTop: '44px',
          paddingBottom: '72px',
          boxSizing: 'border-box',
        }}
      >
        <h1>Dashboard</h1>

        <KeywordResultsView
          keyword={keywordSelecionada}
          temaSelecionado={temaSelecionado}
          results={resultadosKeyword}
          onBack={() => setKeywordSelecionada(null)}
          setView={setView}
          setSelectedItem={setSelectedItem}
          setDetailOrigin={setDetailOrigin}
        />
      </main>
    );
  }

  return (
    <main
      className="container"
      style={{
        paddingTop: '44px',
        paddingBottom: '72px',
        boxSizing: 'border-box',
      }}
    >
      <h1>Dashboard</h1>

      <section style={{ marginTop: '32px', marginBottom: '48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
            gap: '16px',
          }}
        >
          <StatCard title="Total" value={data.length} />
          <StatCard title="Mestrados" value={totalMestrados} />
          <StatCard title="Doutoramentos" value={totalDoutoramentos} />

          <StatCard
              title="Instituições"
              value={
                new Set(
                  data
                    .map((d) => d.instituicao_abreviada || d.instituicao)
                    .filter(Boolean)
                ).size
              }
            />

            <StatCard
              title="Orientadores"
              value={
                new Set(
                  data
                    .flatMap((d) =>
                      String(d.orientador || "")
                        .split(/[;|]+/)
                        .map((n) => n.trim())
                        .filter(Boolean)
                    )
                ).size
              }
            />
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '450px 1fr',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '16px' }}>T&D por tipologia</h2>
            <div style={{ flex: 1 }}>
              <TypePieChart data={data} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '16px' }}>Evolução temporal</h2>
            <div style={{ flex: 1 }}>
              <TemporalTypeChart data={temporalData} />
            </div>
          </div>
        </div>
      </section>


      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>Distribuição temática</h2>
        <ThemeDistributionChart data={data} truncateLabels={false} />
      </section>

      <ThematicTimeline data={data} />

      <SupervisorThemeNetwork data={data} />
      
      <section style={{ marginTop: '40px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            marginBottom: '18px',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Palavras-chave atribuídas pelos autores</h2>
          </div>

          <select
            value={temaSelecionado}
            onChange={(e) => setTemaSelecionado(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              background: '#fff',
              fontSize: '0.95rem',
              minWidth: '280px',
            }}
          >
            <option value="todos">Todos os temas</option>
            {temasUnicos.map((tema) => (
              <option key={tema} value={tema}>
                {tema}
              </option>
            ))}
          </select>
        </div>

        <KeywordCloud
          items={keywordsPorTema}
          onSelectKeyword={setKeywordSelecionada}
        />
      </section>

    </main>
  );
}

export default DashboardView;