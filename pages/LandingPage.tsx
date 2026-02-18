
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
          <i className="fa-solid fa-sparkles"></i>
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
          Recycling Made <span className="text-emerald-600">Effortless</span> & Smarter.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Identify waste materials instantly with AI, track your environmental impact, and find nearby recycling facilities with RecycleSnap.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-camera"></i>
            Start Scanning
          </Link>
          <Link to="/education" className="bg-white text-emerald-700 border-2 border-emerald-100 px-8 py-4 rounded-full text-lg font-bold hover:border-emerald-300 transition-all">
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="bg-emerald-900 text-white py-12 px-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-4xl font-bold mb-2">10k+</h3>
          <p className="text-emerald-200">Items Scanned</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">500+</h3>
          <p className="text-emerald-200">Recycling Centers</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">15 Tons</h3>
          <p className="text-emerald-200">Waste Diverted</p>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon="fa-robot" 
          title="AI Image Scanning" 
          desc="Just snap a photo. Our advanced AI identifies the material and tells you exactly how to recycle it."
        />
        <FeatureCard 
          icon="fa-map-pin" 
          title="Smart Locator" 
          desc="Discover local drop-off points, hazardous waste centers, and collection hubs tailored to your location."
        />
        <FeatureCard 
          icon="fa-trophy" 
          title="Eco Rewards" 
          desc="Earn points for every item you recycle correctly. Compete with friends and earn exclusive badges."
        />
      </section>
      
      {/* How it works */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-1 bg-emerald-100 -z-10"></div>
          <Step num="1" title="Snap" desc="Take a photo of your waste" icon="fa-camera" />
          <Step num="2" title="Analyze" desc="AI identifies the material" icon="fa-microchip" />
          <Step num="3" title="Learn" desc="Get disposal instructions" icon="fa-book-open" />
          <Step num="4" title="Drop" desc="Find the nearest recycler" icon="fa-truck-arrow-right" />
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-stone-200 hover:border-emerald-500 transition-all hover:shadow-xl group">
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
      <i className={`fa-solid ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; title: string; desc: string; icon: string }> = ({ num, title, desc, icon }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-6 relative z-10">
      <i className={`fa-solid ${icon} text-2xl`}></i>
      <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
        {num}
      </div>
    </div>
    <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
    <p className="text-sm text-slate-500 px-4">{desc}</p>
  </div>
);

export default LandingPage;
