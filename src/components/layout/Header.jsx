import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo-td-rcaap.png';

function Header({ setView, view }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1100;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { key: 'home', label: 'Início' },
    { key: 'dissertacoes', label: 'Pesquisa' },
    { key: 'dashboard', label: 'Dashboard' },
    {
      key: 'metaverse',
      label: 'Galeria virtual',
      external: true,
      url: 'https://www.spatial.io/s/Galeria-virtual-69ed0621476ec3390da81e36',
    },
    { key: 'sobre', label: 'Sobre' },
  ];

  const goTo = (item) => {
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      setMenuOpen(false);
      return;
    }

    setView(item.key);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        background: 'linear-gradient(90deg,#0d66b3,#082b68)',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <img
          src={logo}
          alt="RCAAP HD"
          style={{
            height: isMobile ? '48px' : '56px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => goTo({ key: 'home' })}
        />

        {!isMobile ? (
          <nav
            style={{
              display: 'flex',
              gap: '22px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {menuItems.map((item) => (
              <span
                key={item.key}
                onClick={() => goTo(item)}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  paddingBottom: '4px',
                  borderBottom:
                    !item.external &&
                    (view === item.key || hoveredItem === item.key)
                      ? '2px solid #8ccbe7'
                      : hoveredItem === item.key
                      ? '2px solid #8ccbe7'
                      : '2px solid transparent',
                  transition: 'all .2s ease',
                }}
              >
                {item.label}
                {item.external && ' ↗'}
              </span>
            ))}
          </nav>
        ) : (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            background: '#0b3d82',
            padding: '10px 24px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {menuItems.map((item) => (
            <span
              key={item.key}
              onClick={() => goTo(item)}
              style={{
                cursor: 'pointer',
                fontWeight: !item.external && view === item.key ? 700 : 600,
                color: '#fff',
              }}
            >
              {item.label}
              {item.external && ' ↗'}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;