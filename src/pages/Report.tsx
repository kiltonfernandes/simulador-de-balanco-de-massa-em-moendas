import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateMillRegulation } from "@/lib/calculator";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AberturasChart from "@/components/charts/AberturasChart";
import PressoesChart from "@/components/charts/PressoesChart";
import VelocidadesChart from "@/components/charts/VelocidadesChart";
import EficienciaChart from "@/components/charts/EficienciaChart";
import InputRangesInfo from "@/components/InputRangesInfo";

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

  const handleExportPDF = async () => {
    try {
      const reportElement = document.getElementById('report-content');
      if (!reportElement) return;

      // Configurações para melhor qualidade
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm');
      let position = 0;

      // Adicionar primeira página
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Gerar nome do arquivo
      const fileName = `MillCalc_${formData.usina?.usina || 'Relatorio'}_${formData.usina?.safra || new Date().getFullYear()}.pdf`;
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    }
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
      <div className="container mx-auto px-4 py-8" id="report-content">
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
                <div className={`text-3xl font-bold mb-2 ${
                  results?.summary?.status === 'success' ? 'text-green-600' : 
                  results?.summary?.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results?.summary?.status === 'success' ? '✓' : 
                   results?.summary?.status === 'warning' ? '⚠' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {results?.summary?.status === 'success' ? 'Calculado' : 
                   results?.summary?.status === 'warning' ? 'Com Avisos' : 'Erro'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faixas de Entrada */}
          <InputRangesInfo />

          {/* Resultados por Terno */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Resultados por Terno
            </h2>
            
            {results?.ternos?.map((terno) => (
              <Card key={terno.id} className="shadow-card border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-foreground">
                    {terno.id}º Terno
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Aberturas (mm)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pressão:</span>
                          <span className="font-medium">{terno.aberturas.pressao_trabalho.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">{terno.aberturas.entrada_trabalho.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saída:</span>
                          <span className="font-medium">{terno.aberturas.saida_trabalho.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Bagaceiras (mm)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">{terno.bagaceiras.entrada.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Centro:</span>
                          <span className="font-medium">{terno.bagaceiras.centro.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saída:</span>
                          <span className="font-medium">{terno.bagaceiras.saida.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Pressões (psi)</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hidráulica:</span>
                          <span className="font-medium">{terno.pressoes.hidraulica_trabalho.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mancal:</span>
                          <span className="font-medium">{terno.pressoes.mancal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nitrogênio:</span>
                          <span className="font-medium">{terno.pressoes.nitrogenio.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Velocidades</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rotação:</span>
                          <span className="font-medium">{terno.velocidades.rotacao.toFixed(1)} rpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Periférica:</span>
                          <span className="font-medium">{terno.velocidades.periferica_media.toFixed(1)} m/min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bagaço:</span>
                          <span className="font-medium">{terno.bagaco.toneladas_hora.toFixed(1)} t/h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              // Fallback se não houver resultados
              Array.from({ length: 6 }, (_, i) => i + 1).map((terno) => (
                <Card key={terno} className="shadow-card border-border/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-foreground">
                      {terno}º Terno
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      Dados não disponíveis
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Gráficos de Análise */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gráficos de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Aberturas */}
                <div className="bg-card rounded-lg p-4 border border-border/50">
                  {results?.graficos?.aberturas_data ? (
                    <AberturasChart data={results.graficos.aberturas_data} />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Dados não disponíveis</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gráfico de Pressões */}
                <div className="bg-card rounded-lg p-4 border border-border/50">
                  {results?.graficos?.pressoes_data ? (
                    <PressoesChart data={results.graficos.pressoes_data} />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Dados não disponíveis</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gráfico de Velocidades */}
                <div className="bg-card rounded-lg p-4 border border-border/50">
                  {results?.graficos?.velocidades_data ? (
                    <VelocidadesChart data={results.graficos.velocidades_data} />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Dados não disponíveis</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gráfico de Eficiência */}
                <div className="bg-card rounded-lg p-4 border border-border/50">
                  {results?.graficos?.eficiencia_data ? (
                    <EficienciaChart data={results.graficos.eficiencia_data} />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Dados não disponíveis</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validações e Observações */}
          {results?.validacao && (
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-foreground">
                  Validações e Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.validacao.erros.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600">Erros:</h4>
                    <ul className="space-y-1">
                      {results.validacao.erros.map((erro, idx) => (
                        <li key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          • {erro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.validacao.avisos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-600">Avisos:</h4>
                    <ul className="space-y-1">
                      {results.validacao.avisos.map((aviso, idx) => (
                        <li key={idx} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                          ⚠ {aviso}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.validacao.observacoes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Observações:</h4>
                    <ul className="space-y-1">
                      {results.validacao.observacoes.map((obs, idx) => (
                        <li key={idx} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                          ℹ {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default Report;