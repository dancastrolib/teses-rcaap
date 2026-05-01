function SobreView() {
  return (
    <main
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '44px clamp(20px, 5vw, 28px) 72px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '900px' }}>
        <h1>Sobre o projeto</h1>

        <section
          style={{
            marginTop: '24px',
            lineHeight: 1.7,
            fontSize: '1.02rem',
          }}
        >
          <p>
          Este projeto foi desenvolvido no âmbito do Mestrado em Humanidades Digitais da
          Escola de Letras, Artes e Ciências Humanas da Universidade do Minho. O seu foco
          central é a análise e visualização de teses e dissertações da área, defendidas
          em instituições de ensino superior portuguesas. 
          </p><br></br>

          <p>
          O trabalho resultou no desenvolvimento de um dashboard interativo que permite
          explorar tipologias de produção académica, tendências ao longo do tempo, dados
          de orientadores e padrões temáticos presentes na coleção.
          </p><br></br>

          <p>
          Os dados foram recolhidos a partir do portal RCAAP, posteriormente enriquecidos, 
          normalizados e organizados, incluindo categorias temáticas gerais. Esta base de
          dados sustenta uma interface interativa de exploração da coleção, 
          pensada para apoiar a identificação de tendências pesquisa e facilitar a descoberta 
          a partir dos metadados e conteúdos associados às teses e dissertações.
          </p>
        </section>

        <section style={{ marginTop: '36px' }}>
          <h2>Autoria</h2>
          <p style={{ marginTop: '8px' }}>
            Daniela Castro, 2026
          </p>
        </section>
      </div>
    </main>
  );
}

export default SobreView;