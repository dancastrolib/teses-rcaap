function KeywordCloud({ items, onSelectKeyword }) {

  if (!items || items.length === 0) {
    return (
      <div className="keyword-cloud-empty">
        Não há palavras-chave disponíveis para este filtro.
      </div>
    );
  }

  return (
    <div className="keyword-cloud-card">
      <div className="keyword-cloud-header">
        <span>{items.length} palavras-chave</span>
        <small>Clica numa palavra para ver os registos associados</small>
      </div>

      <div className="keyword-cloud-grid">
        {items.map((item) => {
          const strong = item.count >= 6;
          const medium = item.count >= 4;

          return (
            <button
              key={item.keyword}
              type="button"
              onClick={() => onSelectKeyword(item.keyword)}
              className={`keyword-chip ${
                strong ? "strong" : medium ? "medium" : ""
              }`}
            >
              <span>{item.keyword}</span>
              <span className="keyword-count">{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default KeywordCloud;