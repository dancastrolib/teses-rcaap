import BackButton from '../ui/BackButton';

function ThesisDetail({ item, setView, detailOrigin }) {
  if (!item) {
    return (
      <main
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '44px clamp(20px, 5vw, 28px) 72px',
        }}
      >
        <h1>Registo não encontrado</h1>
      </main>
    );
  }

  const getTipoLabel = (tipo) => {
    const t = tipo?.trim().toLowerCase() || '';

    if (t === 'master thesis') return 'Dissertação de mestrado';
    if (t === 'doctoral thesis') return 'Tese de doutoramento';

    return tipo || 's.d.';
  };

  const getTipoClass = (tipo) => {
    const t = tipo?.trim().toLowerCase() || '';

    if (t === 'master thesis') return 'badge badge-dissertacao';
    if (t === 'doctoral thesis') return 'badge badge-tese';

    return 'badge';
  };

  const tema =
    item.descritor_primario_label ||
    item.descritores_label ||
    '';

  const palavrasChave = (item.palavra_chave || '')
    .replace(/\s*[|]\s*/g, '; ')
    .trim();

  return (
    <main
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '44px clamp(20px, 5vw, 28px) 72px',
      }}
    >
      <BackButton
        onClick={() => {
          window.history.replaceState(null, '', '/');

          if (detailOrigin === 'home') {
            setView('home');

            setTimeout(() => {
              const el = document.getElementById('recentes');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 50);
          } else if (detailOrigin === 'dashboard') {
            setView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setView('dissertacoes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <h1 style={{ marginBottom: '20px' }}>
        {item.titulo || 's.d.'}
      </h1>

      <div style={{ display: 'grid', gap: '14px', marginBottom: '32px' }}>
        <p>
          <strong>Autor:</strong> {item.autor || 's.d.'}
        </p>

        <p>
          <strong>Orientador:</strong>{' '}
          {item.orientador
            ? item.orientador.replace(/\s*[|]\s*/g, '; ')
            : 's.d.'}
        </p>

        <p>
          <strong>Ano:</strong> {item.ano || 's.d.'}
        </p>

        <div
          className="card-badges"
          style={{
            marginTop: '0',
            paddingTop: '0',
            marginBottom: '4px',
          }}
        >
          <span className={getTipoClass(item.tipo)}>
            {getTipoLabel(item.tipo)}
          </span>

          {item.instituicao && (
            <span className="badge badge-repositorio">
              {item.instituicao}
            </span>
          )}
        </div>

        <p>
          <strong>Resumo:</strong> {item.resumo || 's.d.'}
        </p>

        <p>
          <strong>Tema:</strong> {tema || 's.d.'}
        </p>

        <p>
          <strong>Palavras-chave:</strong> {palavrasChave || 's.d.'}
        </p>

        <p className="text-meta" style={{ marginTop: '12px' }}>
          <strong>Fonte:</strong>{' '}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {item.repositorio || 's.d.'}
            </a>
          ) : (
            item.repositorio || 's.d.'
          )}
        </p>

        {item.pdf_url && (
          <p className="text-meta" style={{ marginTop: '4px' }}>
            <a
              href={item.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>📄</span>
              <span>Descarregar PDF</span>
            </a>
          </p>
        )}
      </div>
    </main>
  );
}

export default ThesisDetail;