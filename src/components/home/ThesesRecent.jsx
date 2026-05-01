import ThesisCard from '../theses/ThesisCard';

function ThesesRecent({ items, setView, setSelectedItem, setDetailOrigin }) {
  return (
    <div className="recent-grid">
      {items.map((item, index) => (
        <ThesisCard
          key={index}
          item={item}
          onOpen={() => {
            setSelectedItem(item);
            setDetailOrigin('home');
            setView('detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ))}
    </div>
  );
}

export default ThesesRecent;