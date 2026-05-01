function Footer({ setView }) {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '0.9rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px clamp(20px, 5vw, 28px)',
          boxSizing: 'border-box',
        }}
      >
        <p style={{ margin: 0 }}>
          Projeto académico desenvolvido no âmbito do Mestrado em Humanidades Digitais, 
          Universidade do Minho. |
          <span
            onClick={() => setView('sobre')}
            style={{
              color: '#1E6FB9',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '6px',
            }}
          >
            Sobre
          </span>
        </p>

        <p style={{ margin: '6px 0 0' }}>
          Daniela Castro · 2026
        </p>
      </div>
    </footer>
  );
}

export default Footer;