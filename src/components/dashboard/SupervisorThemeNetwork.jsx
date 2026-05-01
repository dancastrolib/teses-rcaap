import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const THEME_COLORS = {
  "Edição digital": "#1E6FB9",
  "Património cultural digital": "#4F8EDC",
  "Comunicação e marketing digital": "#10B981",
  "Gamificação e realidade virtual": "#34D399",
  "Território e comunidades": "#F59E0B",
  "Educação e Literacia": "#FBBF24",
  "Representação do Conhecimento e Ontologias": "#6366F1",
  "Análise e visualização de dados": "#8B5CF6",
  "Estudos literários": "#14B8A6",
  "Métodos computacionais aplicados": "#EC4899",
};

const SUPERVISOR_COLOR = "#475569";
const COSUPERVISION_COLOR = "rgba(100, 116, 139, 0.32)";
const THEME_LINK_COLOR = "rgba(30, 111, 185, 0.22)";

function getThemeColor(theme) {
  return THEME_COLORS[theme] || "#94a3b8";
}

function splitValues(value) {
  return String(value || "")
    .split(/[;|]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function getTheme(item) {
  return (
    item.subject_label?.trim() ||
    item.descritor_primario_label?.trim() ||
    item.subject?.trim() ||
    "Sem tema"
  );
}

function getRecordUrl(item) {
  return item.link || item.record_url || item.url || item.landing_page_url || "";
}

function formatOrientacoes(count) {
  return count === 1 ? "1 orientação" : `${count} orientações`;
}

function formatDegreeStats(master, doctoral) {
  return `${master} mestrado · ${doctoral} doutoramento`;
}

export default function SupervisorThemeNetwork({ data = [] }) {
  const graphRef = useRef();
  const [selected, setSelected] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [institutionFilter, setInstitutionFilter] = useState("todos");
  const [themeFilter, setThemeFilter] = useState("todos");
  const [supervisorFilter, setSupervisorFilter] = useState("todos");

  const institutions = useMemo(() => {
    return [
      ...new Set(
        data
          .map((d) => d.instituicao_abreviada || d.instituicao)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const themes = useMemo(() => {
    return [...new Set(data.map((d) => getTheme(d)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [data]);

  const supervisorsList = useMemo(() => {
    const nomes = new Set();

    data.forEach((item) => {
      splitValues(item.orientador).forEach((nome) => nomes.add(nome));
    });

    return [...nomes].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const institution = item.instituicao_abreviada || item.instituicao;
      const theme = getTheme(item);
      const supervisors = splitValues(item.orientador);

      const matchInstitution =
        institutionFilter === "todos" || institution === institutionFilter;

      const matchTheme = themeFilter === "todos" || theme === themeFilter;

      const matchSupervisor =
        supervisorFilter === "todos" || supervisors.includes(supervisorFilter);

      return matchInstitution && matchTheme && matchSupervisor;
    });
  }, [data, institutionFilter, themeFilter, supervisorFilter]);

  const graphData = useMemo(() => {
    const themeMap = new Map();
    const supervisorMap = new Map();
    const linkMap = new Map();

    filteredData.forEach((item, index) => {
      const theme = getTheme(item);
      const supervisors = splitValues(item.orientador);
      const tipo = String(item.tipo || "").toLowerCase();

      if (!themeMap.has(theme)) {
        themeMap.set(theme, {
          id: `theme-${theme}`,
          type: "theme",
          label: theme,
          count: 0,
        });
      }

      themeMap.get(theme).count += supervisors.length || 1;

      supervisors.forEach((name) => {
        if (!supervisorMap.has(name)) {
          supervisorMap.set(name, {
            id: `supervisor-${name}`,
            type: "supervisor",
            label: name,
            count: 0,
            master: 0,
            doctoral: 0,
            coSupervisionCount: 0,
            themes: {},
            theses: [],
          });
        }

        const supervisor = supervisorMap.get(name);
        supervisor.count += 1;

        if (supervisors.length > 1) supervisor.coSupervisionCount += 1;
        if (tipo === "doctoral thesis") supervisor.doctoral += 1;
        else supervisor.master += 1;

        supervisor.themes[theme] = (supervisor.themes[theme] || 0) + 1;

        supervisor.theses.push({
          id: item.id || `${name}-${index}`,
          title: item.titulo || "Sem título",
          author: item.autor || "",
          year: item.ano || "",
          institution: item.instituicao_abreviada || item.instituicao || "",
          theme,
          degree: item.tipo_label || item.tipo || "",
          description: item.descricao_spatial || item.resumo || "",
          url: getRecordUrl(item),
        });

        const themeLinkKey = `theme-link__${name}__${theme}`;

        if (!linkMap.has(themeLinkKey)) {
          linkMap.set(themeLinkKey, {
            source: `supervisor-${name}`,
            target: `theme-${theme}`,
            value: 0,
            type: "theme",
          });
        }

        linkMap.get(themeLinkKey).value += 1;
      });

      if (supervisors.length > 1) {
        for (let i = 0; i < supervisors.length; i += 1) {
          for (let j = i + 1; j < supervisors.length; j += 1) {
            const ordered = [supervisors[i], supervisors[j]].sort((x, y) =>
              x.localeCompare(y)
            );
            const coLinkKey = `co-link__${ordered[0]}__${ordered[1]}`;

            if (!linkMap.has(coLinkKey)) {
              linkMap.set(coLinkKey, {
                source: `supervisor-${ordered[0]}`,
                target: `supervisor-${ordered[1]}`,
                value: 0,
                type: "co",
              });
            }

            linkMap.get(coLinkKey).value += 1;
          }
        }
      }
    });

    return {
      nodes: [...themeMap.values(), ...supervisorMap.values()],
      links: [...linkMap.values()],
    };
  }, [filteredData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      graphRef.current?.zoomToFit(800, 120);
    }, 800);

    return () => clearTimeout(timer);
  }, [graphData]);

  function handleNodeClick(node) {
    setSelected(node);
    setTimeout(() => graphRef.current?.zoomToFit(600, 120), 100);
  }

  const themeRanking =
    selected?.type === "supervisor"
      ? Object.entries(selected.themes || {}).sort((a, b) => b[1] - a[1])
      : [];

  const selectedThemeRecords =
    selected?.type === "theme"
      ? filteredData.filter((item) => getTheme(item) === selected.label)
      : [];

  return (
    <section className="supervisor-network-section">
      <div className="supervisor-network-header">
        <div>
          <h2>Rede de orientadores</h2>
          <p>
            Relações entre orientadores, temas principais, orientações e
            coorientações.
          </p>
        </div>

        <div className="network-control">
          <strong>Instituição</strong>
          <select
            value={institutionFilter}
            onChange={(e) => {
              setInstitutionFilter(e.target.value);
              setSelected(null);
              setHoverNode(null);
            }}
          >
            <option value="todos">Todas</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>

        <div className="network-control">
          <strong>Tema</strong>
          <select
            value={themeFilter}
            onChange={(e) => {
              setThemeFilter(e.target.value);
              setSelected(null);
              setHoverNode(null);
            }}
          >
            <option value="todos">Todos</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div className="network-control">
          <strong>Orientador</strong>
          <select
            value={supervisorFilter}
            onChange={(e) => {
              setSupervisorFilter(e.target.value);
              setSelected(null);
              setHoverNode(null);
            }}
          >
            <option value="todos">Todos</option>
            {supervisorsList.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="supervisor-network-layout">
        <div className="supervisor-network-graph">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            backgroundColor="#f8fafc"
            cooldownTicks={90}
            onEngineStop={() => graphRef.current?.zoomToFit(500, 120)}
            onNodeClick={handleNodeClick}
            onNodeHover={(node) => setHoverNode(node || null)}
            linkWidth={(link) =>
              link.type === "co"
                ? Math.min(3, 0.8 + link.value)
                : Math.min(4, 0.8 + link.value)
            }
            linkColor={(link) =>
              link.type === "co" ? COSUPERVISION_COLOR : THEME_LINK_COLOR
            }
            linkLineDash={(link) => (link.type === "co" ? [5, 4] : [])}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const isTheme = node.type === "theme";
              const isHover = hoverNode?.id === node.id;
              const isSelected = selected?.id === node.id;

              const radius = isTheme
                ? Math.min(22, 8 + Math.sqrt(node.count) * 4)
                : Math.min(15, 5 + Math.sqrt(node.count) * 4.2);

              if (isTheme) {
                const color = getThemeColor(node.label);

                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.shadowBlur = isHover || isSelected ? 14 : 8;
                ctx.shadowColor = color;
                ctx.fill();
                ctx.shadowBlur = 0;
              } else {
                const color = SUPERVISOR_COLOR;

                ctx.beginPath();
                ctx.arc(
                  node.x,
                  node.y - radius * 0.38,
                  radius * 0.34,
                  0,
                  2 * Math.PI
                );
                ctx.fillStyle = color;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                  node.x,
                  node.y + radius * 0.2,
                  radius * 0.6,
                  Math.PI,
                  0
                );
                ctx.lineTo(node.x + radius * 0.6, node.y + radius * 0.68);
                ctx.lineTo(node.x - radius * 0.6, node.y + radius * 0.68);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
              }

              if (isHover || isSelected) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI);
                ctx.strokeStyle = "rgba(15, 94, 168, 0.28)";
                ctx.lineWidth = 3;
                ctx.stroke();
              }

              if (isTheme || globalScale > 1.8 || isHover || isSelected) {
                ctx.font = `${
                  isTheme ? 11 / globalScale : 9 / globalScale
                }px Inter, Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#334155";
                ctx.fillText(
                  node.label.length > 34
                    ? `${node.label.slice(0, 34)}…`
                    : node.label,
                  node.x,
                  node.y + radius + 5
                );
              }
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(
                node.x,
                node.y,
                node.type === "theme" ? 24 : 20,
                0,
                2 * Math.PI
              );
              ctx.fill();
            }}
          />

          {hoverNode && (
            <div className="network-hover-card">
              <strong>{hoverNode.label}</strong>

              {hoverNode.type === "supervisor" && (
                <>
                  <span>{formatOrientacoes(hoverNode.count)}</span>
                  <span>
                    {formatDegreeStats(hoverNode.master, hoverNode.doctoral)}
                  </span>
                  {hoverNode.coSupervisionCount > 0 && (
                    <span>
                      {hoverNode.coSupervisionCount === 1
                        ? "1 em coorientação"
                        : `${hoverNode.coSupervisionCount} em coorientação`}
                    </span>
                  )}
                </>
              )}

              {hoverNode.type === "theme" && (
                <span>
                  {formatOrientacoes(hoverNode.count)} associadas a este tema
                </span>
              )}
            </div>
          )}
        </div>

        <aside className="supervisor-network-panel">
          {!selected && (
            <>
              <h3>Explorar rede</h3>
              <p>
                Clica num tema para ver a sua centralidade ou num orientador
                para consultar orientações, temas associados, coorientações e
                registos.
              </p>
            </>
          )}

          {selected?.type === "theme" && (
            <>
              <span className="panel-label">Tema</span>
              <h3>{selected.label}</h3>
              <p>{formatOrientacoes(selected.count)} associadas.</p>

              <h4>Registos associados</h4>
              <div className="timeline-record-list">
                {selectedThemeRecords.map((item) => {
                  const url = getRecordUrl(item);

                  return (
                    <article
                      key={item.id || item.titulo}
                      className="timeline-record-card"
                    >
                      <div className="record-meta">
                        <span>
                          {item.instituicao_abreviada || item.instituicao}
                        </span>
                        <span>{item.ano}</span>
                      </div>

                      <h3>{item.titulo || "Sem título"}</h3>
                      <p className="record-author">{item.autor}</p>
                      <p className="record-theme">
                        {item.tipo_label || item.tipo}
                      </p>

                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="source-link"
                        >
                          Ver registo ↗
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {selected?.type === "supervisor" && (
            <>
              <span className="panel-label">Orientador</span>
              <h3>{selected.label}</h3>

              <div className="supervisor-stats">
                <div>
                  <strong>{selected.count}</strong>
                  <span>orientações</span>
                </div>
                <div>
                  <strong>{selected.master}</strong>
                  <span>mestrado</span>
                </div>
                <div>
                  <strong>{selected.doctoral}</strong>
                  <span>doutoramento</span>
                </div>
              </div>

              {selected.coSupervisionCount > 0 && (
                <p className="network-note">
                  {selected.coSupervisionCount === 1
                    ? "1 orientação em coorientação."
                    : `${selected.coSupervisionCount} orientações em coorientação.`}
                </p>
              )}

              <h4>Temas associados</h4>
              <div className="record-tags">
                {themeRanking.map(([theme, count]) => (
                  <span key={theme}>
                    {theme} ({count})
                  </span>
                ))}
              </div>

              <h4>Registos orientados</h4>
              <div className="timeline-record-list">
                {selected.theses.map((t) => (
                  <article key={t.id} className="timeline-record-card">
                    <div className="record-meta">
                      <span>{t.institution}</span>
                      <span>{t.year}</span>
                    </div>
                    <h3>{t.title}</h3>
                    <p className="record-author">{t.author}</p>
                        {t.description && (
                        <p className="record-description">
                            {t.description.split("|").map((part, i) => (
                                <span key={i}>
                                {part.trim()}
                                <br />
                                </span>
                            ))}
                            </p>
                        )}
                    {t.url && (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noreferrer"
                        className="source-link"
                      >
                        Ver registo ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}