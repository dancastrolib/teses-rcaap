import BackButton from '../ui/BackButton';
import ThesisCard from '../theses/ThesisCard';

function KeywordResultsView({
  keyword,
  temaSelecionado,
  results,
  onBack,
  setView,
  setSelectedItem,
  setDetailOrigin,
}) {
  return (
    <section style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <BackButton onClick={onBack} label="Voltar" />

        <h2 style={{ margin: '8px 0' }}>
          Resultados para: {keyword}
        </h2>

        <p style={{ color: '#6b7280' }}>
          {temaSelecionado === 'todos' ? 'Todos os temas' : temaSelecionado} ·{' '}
          {results.length} resultado{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {results.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Nenhum registo encontrado.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '20px',
          }}
        >
          {results.map((item, index) => (
            <ThesisCard
              key={`${item.titulo}-${index}`}
              item={item}
              onOpen={() => {
                setSelectedItem(item);
                setDetailOrigin('dashboard');
                setView('detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default KeywordResultsView;