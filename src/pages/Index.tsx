import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Gauge, FileText, CheckCircle, Cog, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import millBackground from "@/assets/mill-background.jpg";

const Index = () => {
  const navigate = useNavigate();

  const handleSampleData = () => {
    // Navegar para wizard vazio (será preenchido com botão na própria página)
    navigate("/wizard");
  };

  const features = [
    {
      icon: Calculator,
      title: "Cálculos Precisos",
      description: "Algoritmos avançados para regulagem otimizada de moendas"
    },
    {
      icon: Gauge,
      title: "Parâmetros Técnicos",
      description: "Controle total sobre aberturas, pressões e triangulação"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Gráficos interativos e análises técnicas completas"
    },
    {
      icon: FileText,
      title: "Exportação PDF",
      description: "Documentação profissional para sua equipe técnica"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Cog className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MillCalc Pro</h1>
              <p className="text-xs text-muted-foreground">Calculadora de Regulagem de Moendas</p>
            </div>
          </div>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate("/wizard")}
            className="hidden md:flex"
          >
            Começar Cálculo
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-20 px-4 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${millBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Calculadora de
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Regulagem</span>
              <br />de Moendas
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ferramenta profissional para cálculo preciso de aberturas, pressões hidráulicas 
              e triangulação de ternos em moendas de cana-de-açúcar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/wizard")}
              className="w-full sm:w-auto"
            >
              <Calculator className="w-5 h-5" />
              Iniciar Cálculo
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="w-full sm:w-auto"
              onClick={handleSampleData}
            >
              <FileText className="w-5 h-5" />
              Ver Exemplo
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">6</div>
                <div className="text-sm text-muted-foreground">Ternos Calculados</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Parâmetros Técnicos</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">PDF</div>
                <div className="text-sm text-muted-foreground">Relatório Exportável</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Recursos Profissionais
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido com base em metodologias técnicas consolidadas 
              para máxima precisão e confiabilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card border-border/50 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Processo Simplificado
            </h2>
            <p className="text-muted-foreground">
              Em apenas 5 etapas, obtenha todos os cálculos necessários para sua moenda.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: "1", title: "Dados da Usina", desc: "TCH, Fibra %, Safra" },
                { step: "2", title: "Equipamentos", desc: "Especificações técnicas" },
                { step: "3", title: "Camisas & Frisos", desc: "Dimensões e configurações" },
                { step: "4", title: "Operação", desc: "Parâmetros de funcionamento" },
                { step: "5", title: "Relatório", desc: "Resultados e gráficos" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                  {index < 4 && (
                    <div className="hidden md:block w-full h-0.5 bg-gradient-to-r from-primary to-transparent mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="industrial" 
              size="lg"
              onClick={() => navigate("/wizard")}
            >
              <CheckCircle className="w-5 h-5" />
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Cog className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground font-semibold">MillCalc Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Desenvolvido para a indústria sucroalcooleira • Versão 1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;