import { Route, Routes } from "react-router";

import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import CV from "./pages/CV";
import Education from "./pages/Education";
import GitHub from "./pages/GitHub";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Resume from "./pages/Resume";

function App() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/education" element={<Education />} />
          <Route path="/github" element={<GitHub />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;