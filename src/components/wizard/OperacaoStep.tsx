import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, RotateCw, Zap } from "lucide-react";

interface OperacaoStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const OperacaoStep = ({ data, onDataChange }: OperacaoStepProps) => {
  const [formData, setFormData] = useState({
    rotacoes: data.operacao?.rotacoes || [6.5, 6.5, 6.5, 6.0, 6.0, 6.0],
    coeficientes_k: data.operacao?.coeficientes_k || {
      k_et_st: [1.70, 1.70, 1.70, 1.70, 1.70, 2.00],
      k_pt_st: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
      k_ebt_et: [1.6, 1.6, 1.7, 1.7, 1.8, 1.8],
      k_cbt_ebt: [1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
      k_sbt_cbt: [1.05, 1.05, 1.05, 1.05, 1.05, 1.05]
    },
    fibra_bagaco: data.operacao?.fibra_bagaco || [0.30, 0.375, 0.415, 0.45, 0.485, 0.52],
    densidade_bagaco: data.operacao?.densidade_bagaco || [1.4, 1.4, 1.4, 1.4, 1.4, 1.4]
  });

  useEffect(() => {
    onDataChange({ operacao: formData });
  }, [formData, onDataChange]);

  const handleRotacaoChange = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      rotacoes: prev.rotacoes.map((item, i) => i === index ? value : item)
    }));
  };

  const handleCoeficienteChange = (field: string, index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      coeficientes_k: {
        ...prev.coeficientes_k,
        [field]: prev.coeficientes_k[field].map((item: number, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  const handleFibraChange = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      fibra_bagaco: prev.fibra_bagaco.map((item, i) => i === index ? value : item)
    }));
  };

  const handleDensidadeChange = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      densidade_bagaco: prev.densidade_bagaco.map((item, i) => i === index ? value : item)
    }));
  };

  const ternos = [1, 2, 3, 4, 5, 6];

  const coeficientes = [
    { key: "k_et_st", label: "K et/st", desc: "Relação entrada/saída" },
    { key: "k_pt_st", label: "K pt/st", desc: "Relação pressão/saída" },
    { key: "k_ebt_et", label: "K ebt/et", desc: "Relação bagaceira entrada/entrada" },
    { key: "k_cbt_ebt", label: "K cbt/ebt", desc: "Relação bagaceira centro/entrada bagaceira" },
    { key: "k_sbt_cbt", label: "K sbt/cbt", desc: "Relação bagaceira saída/centro bagaceira" }
  ];

  return (
    <div className="space-y-6">
      {/* Rotações */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-primary" />
            Rotações dos Ternos (rpm)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {ternos.map((terno, index) => (
              <div key={terno}>
                <Label htmlFor={`rotacao-${index}`}>
                  {terno}º Terno
                </Label>
                <Input
                  id={`rotacao-${index}`}
                  type="number"
                  step="0.1"
                  value={formData.rotacoes[index]}
                  onChange={(e) => handleRotacaoChange(index, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coeficientes K */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            Coeficientes K (Relações entre Aberturas)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {coeficientes.map((coef, coefIndex) => (
            <div key={coef.key}>
              <div className="mb-3">
                <Label className="text-base font-semibold">{coef.label}</Label>
                <p className="text-sm text-muted-foreground">{coef.desc}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {ternos.map((terno, index) => (
                  <div key={terno}>
                    <Label htmlFor={`${coef.key}-${index}`}>
                      {terno}º Terno
                    </Label>
                    <Input
                      id={`${coef.key}-${index}`}
                      type="number"
                      step="0.01"
                      value={formData.coeficientes_k[coef.key][index]}
                      onChange={(e) => handleCoeficienteChange(
                        coef.key, 
                        index, 
                        parseFloat(e.target.value)
                      )}
                    />
                  </div>
                ))}
              </div>
              {coefIndex < coeficientes.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fibra e Densidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary-foreground" />
              Fibra % Bagaço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ternos.map((terno, index) => (
                <div key={terno}>
                  <Label htmlFor={`fibra-${index}`}>
                    {terno}º Terno
                  </Label>
                  <Input
                    id={`fibra-${index}`}
                    type="number"
                    step="0.001"
                    value={formData.fibra_bagaco[index]}
                    onChange={(e) => handleFibraChange(index, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary-foreground" />
              Densidade Bagaço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ternos.map((terno, index) => (
                <div key={terno}>
                  <Label htmlFor={`densidade-${index}`}>
                    {terno}º Terno
                  </Label>
                  <Input
                    id={`densidade-${index}`}
                    type="number"
                    step="0.1"
                    value={formData.densidade_bagaco[index]}
                    onChange={(e) => handleDensidadeChange(index, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Parâmetros Críticos:</strong> Os coeficientes K e parâmetros operacionais 
          determinam as relações entre as aberturas dos rolos. Ajustes inadequados podem 
          comprometer a eficiência da extração.
        </p>
      </div>
    </div>
  );
};

export default OperacaoStep;