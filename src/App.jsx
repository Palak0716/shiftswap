import { AppProvider } from "./context/AppContext";
import Header from "./components/layout/Header";
import RosterGrid from "./components/roster/RosterGrid";

function App() {
  return (
    <AppProvider>
      <Header page="roster" setPage={() => {}} />

      <main className="p-6">
        <RosterGrid onShift={() => {}} />
      </main>
    </AppProvider>
  );
}

export default App;