function ThesisCard({ item, onOpen }) {
  const getTipoClass = (tipo) => {
    const t = tipo?.toLowerCase() || '';

    if (t.includes('master')) return 'badge badge-dissertacao';
    if (t.includes('doctoral')) return 'badge badge-tese';

    return 'badge';
  };

  const getTipoLabel = (item) => {
    if (item.tipo_label) return item.tipo_label;

    const t = item.tipo?.toLowerCase() || '';

    if (t.includes('master')) return 'Dissertação de mestrado';
    if (t.includes('doctoral')) return 'Tese de doutoramento';

    return item.tipo || '';
  };

  return (
    <div
      className="card"
      onClick={onOpen}
      style={{ cursor: onOpen ? 'pointer' : 'default' }}
    >
      <div className="card-content">
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            {item.titulo}
          </h3>

          <p className="text-meta" style={{ margin: 0 }}>
            <strong>{item.autor}</strong>
            {item.ano ? ` (${item.ano})` : ''}
          </p>

          {item.orientador && item.orientador.trim() && (
            <p className="text-meta">
              Orientador: {item.orientador.replaceAll(';', '; ')}
            </p>
          )}
        </div>

        <p
          className="text-body text-body-clamp"
          style={{ marginBottom: '18px' }}
        >
          {item.resumo
            ? `${item.resumo.slice(0, 170)}...`
            : 'Sem resumo disponível.'}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <span className={getTipoClass(item.tipo)}>
            {getTipoLabel(item)}
          </span>

          {item.instituicao && (
            <span className="badge badge-repositorio">
              {item.instituicao}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThesisCard;