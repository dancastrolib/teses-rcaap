import { BarChart3, BookOpen, FolderKanban, Briefcase } from 'lucide-react';

function StatCard({ title, value }) {


    const iconMap = {
    "Total de trabalhos": BarChart3,
    "Dissertações": BookOpen,
    "Estágios": Briefcase,
    "Projetos": FolderKanban
    };

    const Icon = iconMap[title];

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#fff',
      }}
    >
     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {Icon && <Icon size={16} color="#6b7280" />}
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#6b7280' }}>
            {title}
        </p>
    </div>

        <p
        style={{
            margin: '8px 0 0',
            fontSize: 'clamp(2.5rem, 3vw, 3rem)',
            fontWeight: 800,
            color: '#1E6FB9',
            letterSpacing: '-0.5px'
        }}
        >
        {value}
    </p>
    </div>
  );
}

export default StatCard;