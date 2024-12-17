import { Header } from "@/components/Header";
import { WarningBanner } from "@/components/WarningBanner";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-radial from-blue-50 to-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Förstå riskerna med pump.fun
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            En informativ guide om pump & dump-scheman och varför du bör vara försiktig
          </p>
          <WarningBanner />
        </div>
        
        <section className="mb-16">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Pump.fun och liknande scheman är försök att manipulera kryptovalutors priser 
              genom koordinerade köp och försäljningar. Detta är en form av bedrägeri som 
              kan leda till betydande förluster för investerare.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Det är viktigt att förstå att dessa aktiviteter är olagliga och kan leda till 
              rättsliga konsekvenser. Skydda dig själv genom att vara informerad och undvika 
              att delta i sådana scheman.
            </p>
          </div>
        </section>

        <FAQ />
      </main>
    </div>
  );
};

export default Index;