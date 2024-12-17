import { TokenBoard } from "@/components/TokenBoard";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <TokenBoard />
      </main>
    </div>
  );
};

export default Index;