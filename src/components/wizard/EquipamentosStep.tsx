import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cog } from "lucide-react";

interface EquipamentosStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const EquipamentosStep = ({ data, onDataChange }: EquipamentosStepProps) => {
  const [formData, setFormData] = useState({
    fabricante: data.equipamentos?.fabricante || Array(6).fill("DEDINI"),
    diametro_nominal: data.equipamentos?.diametro_nominal || [812.8, 1000, 1075, 1075, 1075, 1075],
    comprimento_nominal: data.equipamentos?.comprimento_nominal || [1524, 2000, 2000, 2000, 2000, 2000],
    angulo_inclinacao: data.equipamentos?.angulo_inclinacao || [0, 0, 15, 15, 15, 15]
  });

  // Atualizar quando dados externos mudarem (botão Ver Exemplo)
  useEffect(() => {
    if (data.equipamentos && JSON.stringify(data.equipamentos) !== JSON.stringify(formData)) {
      setFormData({
        fabricante: data.equipamentos.fabricante || Array(6).fill("DEDINI"),
        diametro_nominal: data.equipamentos.diametro_nominal || [812.8, 1000, 1075, 1075, 1075, 1075],
        comprimento_nominal: data.equipamentos.comprimento_nominal || [1524, 2000, 2000, 2000, 2000, 2000],
        angulo_inclinacao: data.equipamentos.angulo_inclinacao || [0, 0, 15, 15, 15, 15]
      });
    }
  }, [data.equipamentos, formData]);

  useEffect(() => {
    onDataChange({ equipamentos: formData });
  }, [formData, onDataChange]);

  const handleChange = (field: string, index: number, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const ternos = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {ternos.map((terno, index) => (
          <Card key={terno} className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cog className="w-5 h-5 text-primary" />
                {terno}º Terno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`fabricante-${index}`}>Fabricante</Label>
                  <Select
                    value={formData.fabricante[index]}
                    onValueChange={(value) => handleChange("fabricante", index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEDINI">DEDINI</SelectItem>
                      <SelectItem value="ZANINI">ZANINI</SelectItem>
                      <SelectItem value="BECCARO">BECCARO</SelectItem>
                      <SelectItem value="OUTRO">OUTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`diametro-${index}`}>Øc nominal (mm)</Label>
                  <Input
                    id={`diametro-${index}`}
                    type="number"
                    step="0.1"
                    value={formData.diametro_nominal[index]}
                    onChange={(e) => handleChange("diametro_nominal", index, parseFloat(e.target.value))}
                    placeholder="Øc (900 - 1400mm)"
                  />
                </div>
                <div>
                  <Label htmlFor={`comprimento-${index}`}>Lc nominal (mm)</Label>
                  <Input
                    id={`comprimento-${index}`}
                    type="number"
                    value={formData.comprimento_nominal[index]}
                    onChange={(e) => handleChange("comprimento_nominal", index, parseInt(e.target.value))}
                    placeholder="Lc (1800 - 2600mm)"
                  />
                </div>
                <div>
                  <Label htmlFor={`angulo-${index}`}>α (graus)</Label>
                  <Input
                    id={`angulo-${index}`}
                    type="number"
                    value={formData.angulo_inclinacao[index]}
                    onChange={(e) => handleChange("angulo_inclinacao", index, parseInt(e.target.value))}
                    placeholder="α (0 - 15°)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Informação:</strong> As especificações dos equipamentos são fundamentais para os cálculos de regulagem. 
          Verifique os dados técnicos em sua documentação de fábrica.
        </p>
      </div>
    </div>
  );
};

export default memo(EquipamentosStep);