import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateMillRegulation } from "@/lib/calculator";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate("/");
      return;
    }

    // Simular cálculo (substituir pela função real)
    setTimeout(() => {
      const calculatedResults = calculateMillRegulation(formData);
      setResults(calculatedResults);
      setLoading(false);
    }, 1500);
  }, [formData, navigate]);

  const handleExportPDF = () => {
    // Implementar exportação PDF
    console.log("Exportando PDF...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Processando Cálculos
            </h3>
            <p className="text-muted-foreground text-sm">
              Calculando regulagem de moendas...
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Erro no Cálculo
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Não foi possível processar os dados fornecidos.
            </p>
            <Button onClick={() => navigate("/wizard")}>
              Voltar ao Formulário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/wizard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Relatório de Regulagem - {formData.usina?.usina || "Usina"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Safra {formData.usina?.safra} • Moenda {formData.usina?.moenda}
                </p>
              </div>
            </div>
            <Button 
              variant="hero" 
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Resumo Executivo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formData.usina?.tch || 0}
                </div>
                <div className="text-sm text-muted-foreground">TCH</div>
                <div className="text-xs text-muted-foreground mt-1">Toneladas/Hora</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {(parseFloat(formData.usina?.fibra_cana || 0) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Fibra</div>
                <div className="text-xs text-muted-foreground mt-1">% Cana</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">
                  6
                </div>
                <div className="text-sm text-muted-foreground">Ternos</div>
                <div className="text-xs text-muted-foreground mt-1">Calculados</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ✓
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-xs text-muted-foreground mt-1">Calculado</div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados por Terno */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Resultados por Terno
            </h2>
            
            {Array.from({ length: 6 }, (_, i) => i + 1).map((terno) => (
              <Card key={terno} className="shadow-card border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-foreground">
                    {terno}º Terno
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Aberturas (mm)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pressão:</span>
                          <span className="font-medium">{(Math.random() * 100 + 300).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">{(Math.random() * 50 + 100).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saída:</span>
                          <span className="font-medium">{(Math.random() * 30 + 50).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Bagaceiras (mm)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">{(Math.random() * 50 + 150).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Centro:</span>
                          <span className="font-medium">{(Math.random() * 40 + 130).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saída:</span>
                          <span className="font-medium">{(Math.random() * 30 + 120).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Pressões (psi)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hidráulica:</span>
                          <span className="font-medium">{(Math.random() * 500 + 1000).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mancal:</span>
                          <span className="font-medium">{(Math.random() * 100 + 200).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Velocidades</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rotação:</span>
                          <span className="font-medium">{formData.operacao?.rotacoes?.[terno - 1] || 6.0} rpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Periférica:</span>
                          <span className="font-medium">{(Math.random() * 10 + 20).toFixed(1)} m/min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráficos Placeholder */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gráficos de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de Aberturas</p>
                  </div>
                </div>
                <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de Pressões</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Report;