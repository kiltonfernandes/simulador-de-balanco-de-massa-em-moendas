import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Factory, TrendingUp, Calendar } from "lucide-react";

interface UsinaStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const UsinaStep = ({ data, onDataChange }: UsinaStepProps) => {
  const [formData, setFormData] = useState({
    usina: data.usina?.usina || "",
    safra: data.usina?.safra || new Date().getFullYear().toString(),
    moenda: data.usina?.moenda || "A",
    tch: data.usina?.tch || "",
    fibra_cana: data.usina?.fibra_cana || "",
    tc_safra: data.usina?.tc_safra || "",
    dias_safra: data.usina?.dias_safra || "",
    meses_safra: data.usina?.meses_safra || "",
    eficiencia_tempo: data.usina?.eficiencia_tempo || ""
  });

  // Atualizar quando dados externos mudarem (botão Ver Exemplo)
  useEffect(() => {
    if (data.usina) {
      setFormData({
        usina: data.usina.usina || "",
        safra: data.usina.safra || new Date().getFullYear().toString(),
        moenda: data.usina.moenda || "A",
        tch: data.usina.tch || "",
        fibra_cana: data.usina.fibra_cana || "",
        tc_safra: data.usina.tc_safra || "",
        dias_safra: data.usina.dias_safra || "",
        meses_safra: data.usina.meses_safra || "",
        eficiencia_tempo: data.usina.eficiencia_tempo || ""
      });
    }
  }, [data.usina]);

  useEffect(() => {
    onDataChange({ usina: formData });
  }, [formData, onDataChange]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identificação */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Factory className="w-5 h-5 text-primary" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="usina">Nome da Usina</Label>
              <Input
                id="usina"
                value={formData.usina}
                onChange={(e) => handleChange("usina", e.target.value)}
                placeholder="Ex: Usina São João"
              />
            </div>
            <div>
              <Label htmlFor="safra">Safra</Label>
              <Input
                id="safra"
                value={formData.safra}
                onChange={(e) => handleChange("safra", e.target.value)}
                placeholder="2024"
              />
            </div>
            <div>
              <Label htmlFor="moenda">Moenda</Label>
              <Input
                id="moenda"
                value={formData.moenda}
                onChange={(e) => handleChange("moenda", e.target.value)}
                placeholder="A"
              />
            </div>
          </CardContent>
        </Card>

        {/* Capacidade */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Capacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tch">TCH (Toneladas Cana/Hora)</Label>
              <Input
                id="tch"
                type="number"
                value={formData.tch}
                onChange={(e) => handleChange("tch", e.target.value)}
                placeholder="TCH (200 - 1200 t/h)"
              />
            </div>
            <div>
              <Label htmlFor="fibra_cana">F%C (Fibra % Cana)</Label>
              <Input
                id="fibra_cana"
                type="number"
                step="0.01"
                value={formData.fibra_cana}
                onChange={(e) => handleChange("fibra_cana", e.target.value)}
                placeholder="F%C (8% - 18% = 0.08 - 0.18)"
              />
            </div>
            <div>
              <Label htmlFor="tc_safra">TC Safra (Toneladas Cana)</Label>
              <Input
                id="tc_safra"
                type="number"
                value={formData.tc_safra}
                onChange={(e) => handleChange("tc_safra", e.target.value)}
                placeholder="TC Safra (800.000 - 5.000.000 t)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Planejamento */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary-foreground" />
              Planejamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dias_safra">Dias Totais Safra</Label>
              <Input
                id="dias_safra"
                type="number"
                value={formData.dias_safra}
                onChange={(e) => handleChange("dias_safra", e.target.value)}
                placeholder="Dias (180 - 250 dias)"
              />
            </div>
            <div>
              <Label htmlFor="meses_safra">Meses Safra</Label>
              <Input
                id="meses_safra"
                type="number"
                step="0.01"
                value={formData.meses_safra}
                onChange={(e) => handleChange("meses_safra", e.target.value)}
                placeholder="Meses (6.0 - 8.5 meses)"
              />
            </div>
            <div>
              <Label htmlFor="eficiencia_tempo">η Tempo (Eficiência)</Label>
              <Input
                id="eficiencia_tempo"
                type="number"
                step="0.01"
                value={formData.eficiencia_tempo}
                onChange={(e) => handleChange("eficiencia_tempo", e.target.value)}
                placeholder="η Tempo (75% - 95% = 0.75 - 0.95)"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Os dados desta etapa são fundamentais para todos os cálculos posteriores. 
          Certifique-se de que os valores estão corretos e atualizados.
        </p>
      </div>
    </div>
  );
};

export default UsinaStep;