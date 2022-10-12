import {Routes, Route, Outlet} from 'react-router-dom';

import Home from './components/homes/Home';

const App = () => {

  return (
    <div>
      <Routes>
        <Route exact path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
