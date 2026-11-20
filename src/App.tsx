import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BearingsSimulator from './components/BearingsSimulator';
import SinCosTanLab from './components/SinCosTanLab';
import SineRuleLab from './components/SineRuleLab';
import CosineRuleLab from './components/CosineRuleLab';
import TrigPioneers from './components/TrigPioneers';
import NavigatorQuiz from './components/NavigatorQuiz';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FB] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BearingsSimulator />
        <SinCosTanLab />
        <SineRuleLab />
        <CosineRuleLab />
        <TrigPioneers />
        <NavigatorQuiz />
      </main>
      <Footer />
    </div>
  );
}
