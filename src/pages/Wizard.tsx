import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Step components (we'll create these)
import UsinaStep from "@/components/wizard/UsinaStep";
import EquipamentosStep from "@/components/wizard/EquipamentosStep";
import CamisasStep from "@/components/wizard/CamisasStep";
import OperacaoStep from "@/components/wizard/OperacaoStep";
import RevisaoStep from "@/components/wizard/RevisaoStep";

const Wizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Carregar dados de exemplo se fornecidos
  useEffect(() => {
    if (location.state?.sampleData) {
      setFormData(location.state.sampleData);
    }
  }, [location.state]);

  const steps = [
    { id: 1, title: "Dados da Usina", component: UsinaStep },
    { id: 2, title: "Equipamentos", component: EquipamentosStep },
    { id: 3, title: "Camisas & Frisos", component: CamisasStep },
    { id: 4, title: "Operação", component: OperacaoStep },
    { id: 5, title: "Revisão", component: RevisaoStep }
  ];

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Navigate to report
      navigate("/report", { state: { formData } });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                MillCalc Pro - {steps[currentStep - 1].title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Etapa {currentStep} de {steps.length}
                </span>
                <div className="flex-1 max-w-xs">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-secondary/20 border-b border-secondary/30 py-3 px-4">
        <div className="container mx-auto">
          <p className="text-sm text-secondary-foreground text-center">
            ⚠️ Seus dados não são salvos. Ao fechar esta aba, todas as informações serão perdidas.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  {currentStep}
                </div>
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <CurrentStepComponent 
                data={formData}
                onDataChange={handleStepData}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/50">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>

                <div className="flex items-center gap-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full ${
                        step.id <= currentStep 
                          ? "bg-primary" 
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button 
                  variant={currentStep === steps.length ? "hero" : "default"}
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {currentStep === steps.length ? (
                    <>
                      <Calculator className="w-4 h-4" />
                      Calcular
                    </>
                  ) : (
                    <>
                      Avançar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wizard;