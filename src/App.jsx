import { useEffect, useState } from 'react';
import { parseCSV } from './utils/csvParser';
import { processData } from './utils/dataProcessing';

import Header from './components/layout/Header';
import HomePage from './components/home/HomePage';
import ThesesView from './components/theses/ThesesView';
import ThesisDetail from './components/theses/ThesisDetail';
import DashboardView from './components/dashboard/DashboardView';
import SobreView from './components/layout/SobreView';
import Footer from './components/layout/Footer';

function App() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailOrigin, setDetailOrigin] = useState('dissertacoes');

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/data/rcaap_hd_teses_prof3b.csv');
        const text = await res.text();
        const records = parseCSV(text);

        if (!records || records.length === 0) {
          setData([]);
          return;
        }

        const processed = processData(records);
        setData(processed);
      } catch (error) {
        console.error('Erro ao carregar CSV:', error);
        setData([]);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Header view={view} setView={setView} />

      {view === 'home' && (
        <HomePage
          data={data}
          setView={setView}
          setSelectedItem={setSelectedItem}
          setDetailOrigin={setDetailOrigin}
        />
      )}

      {view === 'dissertacoes' && (
        <ThesesView
          data={data}
          setView={setView}
          setSelectedItem={setSelectedItem}
          setDetailOrigin={setDetailOrigin}
        />
      )}

      {view === 'detail' && selectedItem && (
        <ThesisDetail
          item={selectedItem}
          setView={setView}
          detailOrigin={detailOrigin}
        />
      )}

      {view === 'dashboard' && (
        <DashboardView
          data={data}
          setView={setView}
          setSelectedItem={setSelectedItem}
          setDetailOrigin={setDetailOrigin}
        />
      )}

      {view === 'sobre' && <SobreView />}

      <Footer setView={setView} />
    </div>
  );
}

export default App;