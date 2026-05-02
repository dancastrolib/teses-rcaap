import { useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function splitSubjects(value) {
  return String(value || "")
    .split(/[|;]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function getValue(row, keys, fallback = "") {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "") {
      return row[key];
    }
  }
  return fallback;
}

function cleanDescription(text) {
  if (!text) return "";

  const parts = String(text)
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts.slice(1).join(" | ") : text;
}

function short(text, max = 70) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export default function ThematicTimeline({ data = [] }) {
  const [themeFilter, setThemeFilter] = useState("todos");
  const [yearStart, setYearStart] = useState(null);
  const [yearEnd, setYearEnd] = useState(null);
  const [selected, setSelected] = useState(null);

  const years = useMemo(() => {
  const ys = data.map((d) => Number(d.ano)).filter(Boolean);

  const min = Math.min(...ys);
  const max = Math.max(...ys);

  const fullRange = [];
  for (let y = min; y <= max; y++) {
    fullRange.push(y);
  }

    return fullRange;
  }, [data]);

  const minYear = years[0] || 2017;
  const maxYear = years.at(-1) || 2025;
  const activeStartYear = yearStart ?? minYear;
  const activeEndYear = yearEnd ?? maxYear;

  const themes = useMemo(() => {
    const set = new Set();

    data.forEach((d) => {
      splitSubjects(
        getValue(d, ["descritores_label", "descritor_primario_label", "subject"])
      ).forEach((s) => set.add(s));
    });

    return [...set].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filtered = useMemo(() => {
    return data
      .map((d, index) => {
        const themes = splitSubjects(
          getValue(d, ["descritores_label", "descritor_primario_label", "subject"])
        );

        return {
          id: d.id || `tese-${index}`,
          title: d.titulo || "Sem título",
          author: d.autor || "Autor não identificado",
          institution:
            d.instituicao_abreviada || d.instituicao || "Sem instituição",
          year: Number(d.ano) || "",
          degree: d.tipo_label || d.grau || d.tipo || "",
          mainTheme:
            d.descritor_primario_label || d.subject || "Sem tema principal",
          themes,
          keywords: splitSubjects(d.palavra_chave),
          description: cleanDescription(d.descricao_spatial) || d.resumo || "",
          url: d.record_url || d.landing_page_url || d.url || "",
        };
      })
      .filter((d) => {
        const matchYear =
          !d.year || (d.year >= activeStartYear && d.year <= activeEndYear);

        const matchTheme =
          themeFilter === "todos" ? true : d.themes.includes(themeFilter);

        return matchYear && matchTheme;
      });
  }, [data, activeStartYear, activeEndYear, themeFilter]);

  const institutions = useMemo(() => {
    const counts = {};

    filtered.forEach((d) => {
      counts[d.institution] = (counts[d.institution] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([institution]) => institution);
  }, [filtered]);

  const chartItems = useMemo(() => {
    const grouped = {};

    return filtered.map((d) => {
      const key = `${d.institution}-${d.year}`;
      grouped[key] = (grouped[key] || 0) + 1;

      return {
        ...d,
        offset: grouped[key],
      };
    });
  }, [filtered]);

  const width = 920;
  const height = Math.max(420, institutions.length * 54 + 100);
  const left = 120;
  const right = 40;
  const top = 50;
  const bottom = 60;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const xForYear = (year) => {
    if (maxYear === minYear) return left + plotWidth / 2;
    return left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  };

  const yForInstitution = (institution) => {
    const index = institutions.indexOf(institution);
    if (institutions.length <= 1) return top + plotHeight / 2;
    return top + (index / (institutions.length - 1)) * plotHeight;
  };

  const selectedList = selected ? [selected] : filtered;

  return (
    <section className="creative-timeline-section">
      <div className="creative-timeline-header">
        <div>
          <h2>Cronologia por instituição</h2>
          <p>
            Visualização interativa da distribuição temporal das teses e
            dissertações por instituição, tema e grau académico.
          </p>
        </div>

        <div className="timeline-control">
          <strong>Selecionar tema:</strong>
          <select
            value={themeFilter}
            onChange={(e) => {
              setThemeFilter(e.target.value);
              setSelected(null);
            }}
          >
            <option value="todos">Todos os temas</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div className="timeline-year-control">
          <strong>
            De {activeStartYear} até {activeEndYear}
          </strong>

        <Slider
          range
          min={minYear}
          max={maxYear}
          value={[activeStartYear, activeEndYear]}
          onChange={(value) => {
            if (!Array.isArray(value)) return;

            const [start, end] = value;
            setYearStart(start);
            setYearEnd(end);
            setSelected(null);
          }}
        />
        </div>
      </div>

      <div className="creative-timeline-layout">
        <div className="creative-timeline-chart">
          <svg viewBox={`0 0 ${width} ${height}`} role="img">
            {years.map((year) => {
              const x = xForYear(year);

              return (
                <g key={year}>
                  <line
                    x1={x}
                    x2={x}
                    y1={top - 20}
                    y2={height - bottom + 12}
                    stroke="#e5edf7"
                  />
                  <text
                    x={x}
                    y={height - 22}
                    textAnchor="middle"
                    className="timeline-axis-label"
                  >
                    {year}
                  </text>
                </g>
              );
            })}

            {institutions.map((institution) => {
              const y = yForInstitution(institution);

              return (
                <g key={institution}>
                  <line
                    x1={left}
                    x2={width - right}
                    y1={y}
                    y2={y}
                    stroke="#eef2f7"
                  />
                  <text
                    x={left - 14}
                    y={y + 4}
                    textAnchor="end"
                    className="timeline-institution-label"
                  >
                    {institution}
                  </text>
                </g>
              );
            })}

            {chartItems.map((d) => {
              const x = xForYear(d.year) + ((d.offset - 1) % 4) * 12;
              const y =
                yForInstitution(d.institution) +
                Math.floor((d.offset - 1) / 4) * 12;
              const isDoctoral = String(d.degree)
                .toLowerCase()
                .includes("doutoramento");
              const isSelected = selected?.id === d.id;

              return (
                <g
                  key={d.id}
                  className="timeline-point-group"
                  onClick={() => setSelected(d)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 13 : 9}
                    fill={isDoctoral ? "#f59e0b" : "#1d70b8"}
                    opacity={isSelected ? 1 : 0.82}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 20 : 15}
                    fill="transparent"
                    stroke={isSelected ? "#0f5ea8" : "transparent"}
                    strokeWidth="2"
                  />
                  <title>{`${d.title} — ${d.institution}, ${d.year}`}</title>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="creative-timeline-panel">
          <div className="panel-summary">
            <span>{filtered.length}</span>
            <p>registos encontrados</p>
          </div>

          {selected && (
            <button
              type="button"
              className="panel-back-button"
              onClick={() => setSelected(null)}
            >
              Ver todos os registos
            </button>
          )}

          <div className="timeline-record-list">
            {selectedList.map((item) => {
              const isDoctoral = item.degree
                .toLowerCase()
                .includes("doutoramento");

              return (
                <article
                  key={item.id}
                  className={`timeline-record-card ${
                    selected?.id === item.id ? "active" : ""
                  }`}
                  onClick={() => setSelected(item)}
                >
                  <div className="record-meta">
                    <span>{item.institution}</span>
                    <span>{item.year}</span>
                  </div>

                  <h3>{item.title}</h3>

                  <p className="record-author">{item.author}</p>

                  {item.degree && (
                    <div className="record-badges">
                      <span
                        className={`badge badge-degree ${
                          isDoctoral ? "badge-phd" : "badge-master"
                        }`}
                      >
                        {item.degree}
                      </span>
                    </div>
                  )}

                  {selected?.id === item.id && (
                    <>
                      {item.themes?.length > 0 && (
                        <div className="record-tags">
                          {item.themes.map((theme) => (
                            <span key={theme}>{theme}</span>
                          ))}
                        </div>
                      )}

                      {item.description && (
                        <p className="record-description">
                          {short(item.description, 260)}
                        </p>
                      )}

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="source-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver registo na fonte ↗
                        </a>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}