import { useMemo, useState, useEffect } from 'react';
import heroImg from '../../assets/images/hero.png';
import StatCard from '../dashboard/StatCard';
import TemporalChart from '../dashboard/TemporalChart';
import InstitutionsChart from '../dashboard/InstitutionsChart';
import ThesesRecent from './ThesesRecent';

function HomePage({
  data,
  setView,
  setSelectedItem,
  setDetailOrigin,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = useMemo(() => {
    const total = data.length;

    const mestrados = data.filter((item) => {
      const tipo = item.tipo?.trim().toLowerCase() || '';
      return tipo === 'master thesis';
    }).length;

    const doutoramentos = data.filter((item) => {
      const tipo = item.tipo?.trim().toLowerCase() || '';
      return tipo === 'doctoral thesis';
    }).length;

    const instituicoes = new Set(
      data.map((item) => item.instituicao).filter(Boolean)
    ).size;

    const orientadoresSet = new Set();

    data.forEach((item) => {
      (item.orientador || '')
        .split(/[;|]+/)
        .map((nome) => nome.trim())
        .filter(Boolean)
        .forEach((nome) => orientadoresSet.add(nome));
    });

    const orientadores = orientadoresSet.size;

    return {
      total,
      mestrados,
      doutoramentos,
      instituicoes,
      orientadores,
    };
  }, [data]);

  const temporalData = useMemo(() => {
    const anos = [...new Set(data.map((d) => Number(d.ano)))]
      .filter((ano) => !Number.isNaN(ano) && ano)
      .sort((a, b) => a - b);

    return anos.map((ano) => {
      const itemsAno = data.filter((d) => Number(d.ano) === ano);

      const dissertacoesPT = itemsAno.filter(
        (d) =>
          d.tipo?.trim().toLowerCase() === 'master thesis' &&
          d.idioma?.trim().toLowerCase() === 'por'
      ).length;

      const dissertacoesEN = itemsAno.filter(
        (d) =>
          d.tipo?.trim().toLowerCase() === 'master thesis' &&
          d.idioma?.trim().toLowerCase() === 'eng'
      ).length;

      const tesesPT = itemsAno.filter(
        (d) =>
          d.tipo?.trim().toLowerCase() === 'doctoral thesis' &&
          d.idioma?.trim().toLowerCase() === 'por'
      ).length;

      const tesesEN = itemsAno.filter(
        (d) =>
          d.tipo?.trim().toLowerCase() === 'doctoral thesis' &&
          d.idioma?.trim().toLowerCase() === 'eng'
      ).length;

      return {
        ano: String(ano),
        total: itemsAno.length,
        dissertacoesPT,
        dissertacoesEN,
        tesesPT,
        tesesEN,
      };
    });
  }, [data]);

  const instituicoesTop = useMemo(() => {
    const mapa = {};

    data.forEach((item) => {
      const nome =
        item.instituicao_abreviada?.trim() || item.instituicao?.trim() || '';
      if (!nome) return;
      mapa[nome] = (mapa[nome] || 0) + 1;
    });

    return Object.entries(mapa)
      .map(([instituicao_abreviada, total]) => ({
        instituicao_abreviada,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const recentes = useMemo(() => {
    return [...data]
      .sort((a, b) => Number(b.ano) - Number(a.ano))
      .slice(0, 6);
  }, [data]);

  return (
      <main
        className="site-shell"
        style={{
          paddingTop: '44px',
          paddingBottom: '72px',
        }}
      >
        <section
          id="inicio"
          style={{
            marginBottom: '64px',
            paddingTop: '56px',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'minmax(420px, 0.95fr) minmax(420px, 1.05fr)',

            gap: isMobile ? '28px' : '56px',
            alignItems: 'center',
          }}
        >
      <h1
        style={{
          fontSize: 'clamp(2.6rem, 3vw, 3rem)',
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          margin: 0,
          paddingBottom: '6px',
          maxWidth: '760px',
          background: 'linear-gradient(90deg, #1E6FB9, #0A2A66)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
            Observatório de <br />
            Teses e Dissertações <br />
            em Humanidades <br />
            Digitais
        </h1>

        <div>
          <img
            src={heroImg}
            alt="Visualização de dados"
            style={{
              width: '100%',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          />

          <p
            style={{
              fontSize: '1.16rem',
              maxWidth: '820px',
              lineHeight: 1.65,
              marginTop: '16px',
              margin: '0 auto',
            }}
          >
            Plataforma de acesso e análise de teses e dissertações defendidas
            em instituições do ensino superior português, com dados
            estruturados, resumos e exploração analítica da coleção disponível
            através do portal RCAAP - Repositórios Científicos de Acesso Aberto de Portugal.
          </p>
        </div>
      </section>

      <section
        id="indicadores"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}
      >
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Mestrados" value={stats.mestrados} />
        <StatCard title="Doutoramentos" value={stats.doutoramentos} />
        <StatCard title="Instituições" value={stats.instituicoes} />
        <StatCard title="Orientadores" value={stats.orientadores} />
      </section>

        <section
          id="visualizacoes"
          style={{
            marginBottom: '48px',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(2, minmax(0, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Evolução temporal</h2>
          <div
              style={{
                flex: 1,
                minHeight: isMobile ? '300px' : '360px',
                width: '100%',
                overflow: 'hidden',
              }}
            >
            <TemporalChart
              data={temporalData}
              lines={[
                {
                  dataKey: 'total',
                  name: 'Total',
                  stroke: '#1E6FB9',
                },
              ]}
              showLegend={false}
              tooltipDetails={[
                { dataKey: 'dissertacoesPT', name: 'Dissertações PT' },
                { dataKey: 'dissertacoesEN', name: 'Dissertações EN' },
                { dataKey: 'tesesPT', name: 'Teses PT' },
                { dataKey: 'tesesEN', name: 'Teses EN' },
              ]}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Top instituições</h2>
          <div
            style={{
              flex: 1,
              minHeight: isMobile ? '300px' : '360px',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <InstitutionsChart
              data={instituicoesTop}
              truncateLabels={true}
              compact={true}
            />
          </div>
        </div>
      </section>

      <section id="recentes" style={{ marginBottom: '48px' }}>
        <h2>Entradas mais recentes</h2>
        <ThesesRecent
          items={recentes}
          setView={setView}
          setSelectedItem={setSelectedItem}
          setDetailOrigin={setDetailOrigin}
        />
      </section>
    </main>
  );
}

export default HomePage;