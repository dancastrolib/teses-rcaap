function TableResults({ items }) {
  const getTema = (item) =>
    item.descritor_assunto || item.palavra_chave || '-';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>Título</th>
          <th style={thStyle}>Autor</th>
          <th style={thStyle}>Assunto</th>
          <th style={thStyle}>Tipo</th>
          <th style={thStyle}>Ano</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td style={tdStyle}>{item.titulo}</td>
            <td style={tdStyle}>{item.autor}</td>
            <td style={tdStyle}>{getTema(item)}</td>
            <td style={tdStyle}>{item.tipo}</td>
            <td style={tdStyle}>{item.ano}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

export default TableResults;