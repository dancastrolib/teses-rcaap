import { useMemo, useState } from 'react';
import ThesisCard from './ThesisCard';

function ThesesView({ data, setView, setSelectedItem, setDetailOrigin }) {
  const [query, setQuery] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [temaFiltro, setTemaFiltro] = useState('todos');
  const [instituicaoFiltro, setInstituicaoFiltro] = useState('todos');
  const [orientadorFiltro, setOrientadorFiltro] = useState('todos');
  const [anoInicialFiltro, setAnoInicialFiltro] = useState('todos');
  const [anoFinalFiltro, setAnoFinalFiltro] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const getTemaBase = (item) => {
    const fonte =
      item.subject ||
      item.palavra_chave ||
      '';

    if (!fonte) return '';

    return (
      fonte
        .split(/[,;|]+/)
        .map((v) => v.trim())
        .filter(Boolean)[0] || ''
    );
  };

  const temasUnicos = useMemo(() => {
    return [...new Set(data.map((item) => getTemaBase(item)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [data]);

  const instituicoesUnicas = useMemo(() => {
    return [
      ...new Set(
        data
          .map((item) => item.instituicao || '')
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const orientadoresUnicos = useMemo(() => {
    return [
      ...new Set(
        data.flatMap((item) =>
          (item.orientador || '')
            .split(/[;|]+/)
            .map((nome) => nome.trim())
            .filter(Boolean)
        )
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const anosUnicos = useMemo(() => {
    return [...new Set(data.map((item) => String(item.ano)).filter(Boolean))].sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [data]);

  const limparFiltros = () => {
    setQuery('');
    setTipoFiltro('todos');
    setTemaFiltro('todos');
    setInstituicaoFiltro('todos');
    setOrientadorFiltro('todos');
    setAnoInicialFiltro('todos');
    setAnoFinalFiltro('todos');
    setOrdenacao('recentes');
  };

  const haFiltrosAtivos =
    query.trim() !== '' ||
    tipoFiltro !== 'todos' ||
    temaFiltro !== 'todos' ||
    instituicaoFiltro !== 'todos' ||
    orientadorFiltro !== 'todos' ||
    anoInicialFiltro !== 'todos' ||
    anoFinalFiltro !== 'todos' ||
    ordenacao !== 'recentes';

  const resultados = useMemo(() => {
    return data
      .filter((item) => {
        const textoPesquisa = query.toLowerCase().trim();
        const temaBase = getTemaBase(item);
        const tipo = item.tipo?.trim().toLowerCase() || '';
        const anoItem = Number(item.ano);

        const matchQuery =
          !textoPesquisa ||
          [
            item.titulo,
            item.autor,
            item.resumo,
            item.palavra_chave,
            item.orientador,
            item.repositorio,
            item.instituicao,
            item.subject,
            temaBase,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(textoPesquisa);

        const matchTipo =
          tipoFiltro === 'todos' ||
          (tipoFiltro === 'mestrado' && tipo === 'master thesis') ||
          (tipoFiltro === 'doutoramento' && tipo === 'doctoral thesis');

        const matchTema =
          temaFiltro === 'todos' || temaBase === temaFiltro;

        const matchInstituicao =
          instituicaoFiltro === 'todos' ||
          (item.instituicao || '')
            .toLowerCase()
            .includes(instituicaoFiltro.toLowerCase());

        const matchOrientador =
          orientadorFiltro === 'todos' ||
          (item.orientador || '')
            .toLowerCase()
            .includes(orientadorFiltro.toLowerCase());

        const matchAnoInicial =
          anoInicialFiltro === 'todos' ||
          anoItem >= Number(anoInicialFiltro);

        const matchAnoFinal =
          anoFinalFiltro === 'todos' ||
          anoItem <= Number(anoFinalFiltro);

        const intervaloValido =
          anoInicialFiltro === 'todos' ||
          anoFinalFiltro === 'todos' ||
          Number(anoInicialFiltro) <= Number(anoFinalFiltro);

        return (
          intervaloValido &&
          matchQuery &&
          matchTipo &&
          matchTema &&
          matchInstituicao &&
          matchOrientador &&
          matchAnoInicial &&
          matchAnoFinal
        );
      })
      .sort((a, b) => {
        if (ordenacao === 'recentes') return Number(b.ano) - Number(a.ano);
        if (ordenacao === 'antigos') return Number(a.ano) - Number(b.ano);
        if (ordenacao === 'az') {
          return (a.titulo || '').localeCompare(b.titulo || '');
        }
        if (ordenacao === 'za') {
          return (b.titulo || '').localeCompare(a.titulo || '');
        }
        return 0;
      });
  }, [
    data,
    query,
    tipoFiltro,
    temaFiltro,
    instituicaoFiltro,
    orientadorFiltro,
    anoInicialFiltro,
    anoFinalFiltro,
    ordenacao,
  ]);

  const chipBaseStyle = {
    padding: '10px 16px',
    minHeight: '44px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  };

  const getTipoChipStyle = (value) => {
    const ativo = tipoFiltro === value;

    if (!ativo) return chipBaseStyle;

    if (value === 'mestrado') {
      return {
        ...chipBaseStyle,
        background: '#dbeafe',
        border: '1px solid #93c5fd',
        color: '#1d4ed8',
      };
    }

    if (value === 'doutoramento') {
      return {
        ...chipBaseStyle,
        background: '#ffedd5',
        border: '1px solid #fdba74',
        color: '#c2410c',
      };
    }

    return {
      ...chipBaseStyle,
      background: '#eef2ff',
      border: '1px solid #c7d2fe',
      color: '#4338ca',
    };
  };

  const filtroButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: '42px',
    padding: '0 14px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#0A2A66',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
  };

  const primaryButtonStyle = {
    minHeight: '46px',
    padding: '0 18px',
    borderRadius: '10px',
    border: '1px solid #1E6FB9',
    background: '#1E6FB9',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  };

  return (
    <main
      className="container"
      style={{
        paddingTop: '44px',
        paddingBottom: '72px',
      }}
    >
      <h1>Teses e dissertações</h1>

      <div
        className="theses-toolbar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.6fr) auto auto',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              display: 'inline-flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Pesquisar por título, tema, universidade ou palavra-chave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              minHeight: '46px',
              padding: '12px 14px 12px 44px',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              fontSize: '0.95rem',
              background: '#fff',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => setTipoFiltro('todos')}
            style={getTipoChipStyle('todos')}
          >
            Todos
          </button>

          <button
            type="button"
            onClick={() => setTipoFiltro('mestrado')}
            style={getTipoChipStyle('mestrado')}
          >
            Mestrado
          </button>

          <button
            type="button"
            onClick={() => setTipoFiltro('doutoramento')}
            style={getTipoChipStyle('doutoramento')}
          >
            Doutoramento
          </button>
        </div>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          style={{
            width: '100%',
            minHeight: '46px',
            padding: '12px 36px 12px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            fontSize: '0.95rem',
            background: '#fff',
          }}
        >
          <option value="recentes">Mais recentes</option>
          <option value="antigos">Mais antigos</option>
          <option value="az">Título A–Z</option>
          <option value="za">Título Z–A</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setMostrarFiltros((prev) => !prev)}
          style={filtroButtonStyle}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>
            {mostrarFiltros ? '−' : '+'}
          </span>
          <span>{mostrarFiltros ? 'Esconder filtros' : 'Mais filtros'}</span>
        </button>

        {haFiltrosAtivos && (
          <button
            type="button"
            onClick={limparFiltros}
            style={{
              ...filtroButtonStyle,
              color: '#374151',
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <>
          <div
            className="theses-filters-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <select
              value={temaFiltro}
              onChange={(e) => setTemaFiltro(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '12px 36px 12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="todos">Todos os temas</option>
              {temasUnicos.map((tema, index) => (
                <option key={index} value={tema}>
                  {tema}
                </option>
              ))}
            </select>

            <select
              value={instituicaoFiltro}
              onChange={(e) => setInstituicaoFiltro(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '12px 36px 12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="todos">Todas as instituições</option>
              {instituicoesUnicas.map((inst, index) => (
                <option key={index} value={inst}>
                  {inst}
                </option>
              ))}
            </select>

            <select
              value={orientadorFiltro}
              onChange={(e) => setOrientadorFiltro(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '12px 36px 12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="todos">Todos os orientadores</option>
              {orientadoresUnicos.map((orientador, index) => (
                <option key={index} value={orientador}>
                  {orientador.replaceAll('|', '; ')}
                </option>
              ))}
            </select>
          </div>

          <div
            className="theses-date-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 220px) minmax(180px, 220px) auto',
              gap: '12px',
              marginBottom: '20px',
              alignItems: 'center',
              justifyContent: 'start',
              maxWidth: '680px',
            }}
          >
            <select
              value={anoInicialFiltro}
              onChange={(e) => setAnoInicialFiltro(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '12px 36px 12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="todos">Ano inicial</option>
              {anosUnicos.map((ano, index) => (
                <option key={index} value={ano}>
                  {ano}
                </option>
              ))}
            </select>

            <select
              value={anoFinalFiltro}
              onChange={(e) => setAnoFinalFiltro(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '12px 36px 12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="todos">Ano final</option>
              {anosUnicos.map((ano, index) => (
                <option key={index} value={ano}>
                  {ano}
                </option>
              ))}
            </select>

            <button
              type="button"
              style={primaryButtonStyle}
              onClick={() => {}}
            >
              Pesquisar
            </button>
          </div>
        </>
      )}

      <p
        className="text-meta"
        style={{
          marginBottom: '20px',
        }}
      >
        {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}
      </p>

      {resultados.length === 0 ? (
        <p className="text-meta">Nenhum resultado encontrado.</p>
      ) : (
        <div
          className="theses-results-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '20px',
          }}
        >
          {resultados.map((item, index) => (
            <ThesisCard
              key={index}
              item={item}
              onOpen={() => {
                setSelectedItem(item);
                setDetailOrigin('dissertacoes');
                setView('detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1180px) {
          .theses-toolbar {
            grid-template-columns: 1fr !important;
          }

          .theses-filters-grid {
            grid-template-columns: 1fr !important;
          }

          .theses-date-row {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 720px) {
          .theses-results-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

export default ThesesView;