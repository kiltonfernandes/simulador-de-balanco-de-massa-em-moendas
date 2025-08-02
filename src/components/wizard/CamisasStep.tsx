import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle, Ruler } from "lucide-react";

interface CamisasStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const CamisasStep = ({ data, onDataChange }: CamisasStepProps) => {
  const [formData, setFormData] = useState({
    diametros_camisas: data.camisas?.diametros_camisas || {
      pressao: [1060, 1000, 1005, 1005, 1005, 1005],
      entrada: [1140, 1060, 1040, 1000, 1080, 1000],
      superior: [1180, 1090, 1080, 1040, 1120, 1040],
      saida: [1220, 1130, 1120, 1080, 1160, 1080]
    },
    frisos: data.camisas?.frisos || {
      passo: [2, 2, 1.5, 1.5, 1.5, 1.5],
      angulo: [35, 35, 35, 35, 35, 35],
      altura: [62, 62, 42, 42, 42, 42]
    }
  });

  // Atualizar quando dados externos mudarem (botão Ver Exemplo)  
  useEffect(() => {
    if (data.camisas && JSON.stringify(data.camisas) !== JSON.stringify(formData)) {
      setFormData({
        diametros_camisas: data.camisas.diametros_camisas || {
          pressao: [1060, 1000, 1005, 1005, 1005, 1005],
          entrada: [1140, 1060, 1040, 1000, 1080, 1000],
          superior: [1180, 1090, 1080, 1040, 1120, 1040],
          saida: [1220, 1130, 1120, 1080, 1160, 1080]
        },
        frisos: data.camisas.frisos || {
          passo: [2, 2, 1.5, 1.5, 1.5, 1.5],
          angulo: [35, 35, 35, 35, 35, 35],
          altura: [62, 62, 42, 42, 42, 42]
        }
      });
    }
  }, [data.camisas, formData]);

  useEffect(() => {
    onDataChange({ camisas: formData });
  }, [formData, onDataChange]);

  const handleCamisaChange = (posicao: string, index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      diametros_camisas: {
        ...prev.diametros_camisas,
        [posicao]: prev.diametros_camisas[posicao].map((item: number, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  const handleFrisoChange = (field: string, index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      frisos: {
        ...prev.frisos,
        [field]: prev.frisos[field].map((item: number, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  const ternos = [1, 2, 3, 4, 5, 6];
  const posicoes = [
    { key: "pressao", label: "Pressão (PR)", color: "text-red-600" },
    { key: "entrada", label: "Entrada (ET)", color: "text-blue-600" },
    { key: "superior", label: "Superior (SP)", color: "text-green-600" },
    { key: "saida", label: "Saída (SD)", color: "text-purple-600" }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="camisas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camisas" className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Diâmetros das Camisas
          </TabsTrigger>
          <TabsTrigger value="frisos" className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Especificações dos Frisos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camisas" className="space-y-4">
          {posicoes.map((posicao) => (
            <Card key={posicao.key} className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg ${posicao.color}`}>
                  {posicao.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ternos.map((terno, index) => (
                    <div key={terno}>
                      <Label htmlFor={`${posicao.key}-${index}`}>
                        {terno}º Terno (mm)
                      </Label>
                      <Input
                        id={`${posicao.key}-${index}`}
                        type="number"
                        value={formData.diametros_camisas[posicao.key][index]}
                        onChange={(e) => handleCamisaChange(
                          posicao.key, 
                          index, 
                          parseInt(e.target.value)
                        )}
                        placeholder="Ø (800 - 1300mm)"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="frisos" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Especificações dos Frisos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passo */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Passo dos Frisos (pol)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ternos.map((terno, index) => (
                    <div key={terno}>
                      <Label htmlFor={`passo-${index}`}>
                        {terno}º Terno
                      </Label>
                      <Input
                        id={`passo-${index}`}
                        type="number"
                        step="0.1"
                        value={formData.frisos.passo[index]}
                        onChange={(e) => handleFrisoChange(
                          "passo", 
                          index, 
                          parseFloat(e.target.value)
                        )}
                        placeholder="Passo (1.2 - 2.5pol)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ângulo */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Ângulo dos Frisos (º)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ternos.map((terno, index) => (
                    <div key={terno}>
                      <Label htmlFor={`angulo-${index}`}>
                        {terno}º Terno
                      </Label>
                      <Input
                        id={`angulo-${index}`}
                        type="number"
                        value={formData.frisos.angulo[index]}
                        onChange={(e) => handleFrisoChange(
                          "angulo", 
                          index, 
                          parseInt(e.target.value)
                        )}
                        placeholder="Ângulo (25 - 45°)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Altura */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Altura dos Frisos (mm)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ternos.map((terno, index) => (
                    <div key={terno}>
                      <Label htmlFor={`altura-${index}`}>
                        {terno}º Terno
                      </Label>
                      <Input
                        id={`altura-${index}`}
                        type="number"
                        value={formData.frisos.altura[index]}
                        onChange={(e) => handleFrisoChange(
                          "altura", 
                          index, 
                          parseInt(e.target.value)
                        )}
                        placeholder="Altura (40 - 80mm)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Importante:</strong> Os diâmetros das camisas e especificações dos frisos 
          influenciam diretamente na eficiência da extração. Valores incorretos podem 
          resultar em cálculos imprecisos.
        </p>
      </div>
    </div>
  );
};

export default memo(CamisasStep);