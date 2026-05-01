function BackButton({ onClick, label = 'Voltar', style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: '#1E6FB9',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
        padding: 0,
        marginBottom: '12px', // 👈 default
        ...style
      }}
    >
      ← {label}
    </button>
  );
}

export default BackButton;