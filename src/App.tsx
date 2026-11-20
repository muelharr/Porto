import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { CaseStudies } from './components/CaseStudies';
import { Competencies } from './components/Competencies';
import { LabLog } from './components/LabLog';
import { ContactSection, Footer } from './components/Contact';

export function App() {
  return (
    <div className="min-h-screen bg-[#F2F1EC] text-[#111111]">
      <div className="max-w-[1280px] mx-auto border-x border-[#111111]">
        <TopBar />
        <main>
          <Hero />
          <CaseStudies />
          <Competencies />
          <LabLog />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
