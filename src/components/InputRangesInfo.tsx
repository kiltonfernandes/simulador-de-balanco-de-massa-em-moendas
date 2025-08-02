import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const InputRangesInfo = () => {
  const ranges = [
    {
      category: "📊 Capacidade",
      items: [
        { label: "TCH (Toneladas Cana/Hora)", range: "200 - 1200", unit: "t/h" },
        { label: "Fibra % Cana", range: "8 - 18", unit: "%" },
        { label: "TC Safra", range: "800.000 - 5.000.000", unit: "t" },
      ]
    },
    {
      category: "⚙️ Equipamentos", 
      items: [
        { label: "Diâmetro Nominal", range: "900 - 1400", unit: "mm" },
        { label: "Comprimento Nominal", range: "1800 - 2600", unit: "mm" },
        { label: "Ângulo Inclinação", range: "0 - 15", unit: "°" },
      ]
    },
    {
      category: "🔧 Camisas",
      items: [
        { label: "Diâmetros Pressão", range: "800 - 1200", unit: "mm" },
        { label: "Passo Frisos", range: "120 - 200", unit: "mm" },
        { label: "Altura Frisos", range: "40 - 80", unit: "mm" },
      ]
    },
    {
      category: "🚀 Operação",
      items: [
        { label: "Rotações", range: "4.0 - 8.0", unit: "rpm" },
        { label: "Fibra Bagaço", range: "30 - 52", unit: "%" },
        { label: "Densidade Bagaço", range: "1.2 - 1.6", unit: "g/cm³" },
      ]
    },
    {
      category: "📈 Coeficientes K",
      items: [
        { label: "K Entrada/Saída", range: "1.5 - 2.0", unit: "" },
        { label: "K Pressão/Saída", range: "4.0 - 6.0", unit: "" },
        { label: "K Bagaceiras", range: "1.05 - 1.8", unit: "" },
      ]
    }
  ];

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Info className="w-5 h-5" />
          Faixas de Entrada dos Parâmetros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranges.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.range}
                      </span>
                      {item.unit && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-subtle rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Dica:</strong> Valores fora dessas faixas podem gerar avisos ou erros no cálculo. 
            Consulte o manual técnico para parâmetros específicos da sua usina.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputRangesInfo;