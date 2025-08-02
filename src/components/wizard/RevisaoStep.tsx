import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface RevisaoStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const RevisaoStep = ({ data, onDataChange }: RevisaoStepProps) => {
  const [validation, setValidation] = useState({
    isValid: false,
    warnings: [] as string[],
    errors: [] as string[]
  });

  useEffect(() => {
    validateData();
  }, [data]);

  const validateData = () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validações básicas
    if (!data.usina?.usina) errors.push("Nome da usina não informado");
    if (!data.usina?.tch || data.usina.tch <= 0) errors.push("TCH deve ser maior que zero");
    if (!data.usina?.fibra_cana || data.usina.fibra_cana <= 0) errors.push("Fibra % Cana deve ser maior que zero");

    // Validações de equipamentos
    if (!data.equipamentos?.diametro_nominal?.every((d: number) => d > 0)) {
      errors.push("Todos os diâmetros nominais devem ser positivos");
    }

    // Validações de camisas
    if (data.camisas?.diametros_camisas) {
      const { pressao, entrada, superior, saida } = data.camisas.diametros_camisas;
      if (pressao?.some((d: number, i: number) => d >= entrada[i])) {
        warnings.push("Diâmetro de pressão deve ser menor que entrada");
      }
    }

    // Validações operacionais
    if (data.operacao?.rotacoes?.some((r: number) => r <= 0)) {
      errors.push("Todas as rotações devem ser positivas");
    }

    const isValid = errors.length === 0;
    const newValidation = { isValid, warnings, errors };
    
    // Only update validation state if it actually changed
    setValidation(prevValidation => {
      if (JSON.stringify(prevValidation) !== JSON.stringify(newValidation)) {
        return newValidation;
      }
      return prevValidation;
    });
    
    // Do NOT call onDataChange to avoid infinite loops
    // The validation result is internal to this component
  };

  const renderSection = (title: string, data: any, icon: React.ReactNode) => {
    if (!data) return null;
    
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="font-medium">
                  {Array.isArray(value) 
                    ? value.length > 6 
                      ? `[${value.slice(0, 3).join(', ')}...]` 
                      : `[${value.join(', ')}]`
                    : typeof value === 'object'
                      ? '[Configurações]'
                      : String(value)
                  }
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Status de Validação */}
      <Card className={`border-2 ${
        validation.isValid 
          ? 'border-green-200 bg-green-50/50' 
          : 'border-red-200 bg-red-50/50'
      }`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            Status da Validação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validation.isValid ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Todos os dados estão válidos. Pronto para calcular!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {validation.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Erros que impedem o cálculo:</h4>
                  <ul className="space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="w-3 h-3" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-2">Avisos:</h4>
                  <ul className="space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="flex items-center gap-2 text-yellow-600 text-sm">
                        <Info className="w-3 h-3" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Resumo dos Dados Informados
        </h3>

        {renderSection(
          "Dados da Usina", 
          data.usina, 
          <Info className="w-5 h-5 text-blue-600" />
        )}

        {renderSection(
          "Equipamentos", 
          data.equipamentos, 
          <Info className="w-5 h-5 text-green-600" />
        )}

        {renderSection(
          "Camisas e Frisos", 
          data.camisas, 
          <Info className="w-5 h-5 text-purple-600" />
        )}

        {renderSection(
          "Parâmetros Operacionais", 
          data.operacao, 
          <Info className="w-5 h-5 text-orange-600" />
        )}
      </div>

      {/* Próximos Passos */}
      <Card className="border-border/50 bg-gradient-subtle">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">1</Badge>
            <span className="text-sm">Clique em "Calcular" para processar os dados</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">2</Badge>
            <span className="text-sm">Analise os resultados e gráficos no relatório</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">3</Badge>
            <span className="text-sm">Exporte o relatório em PDF se necessário</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Importante:</strong> Verifique todos os dados antes de prosseguir. 
          Uma vez iniciado o cálculo, você será direcionado para o relatório final.
        </p>
      </div>
    </div>
  );
};

export default memo(RevisaoStep);