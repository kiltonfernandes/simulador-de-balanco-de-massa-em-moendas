import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AberturasChartProps {
  data: number[][];
}

const chartConfig = {
  pressao: {
    label: "Pressão (mm)",
    color: "hsl(var(--primary))",
  },
  entrada: {
    label: "Entrada (mm)", 
    color: "hsl(var(--accent))",
  },
  saida: {
    label: "Saída (mm)",
    color: "hsl(var(--secondary))",
  },
};

const AberturasChart = ({ data }: AberturasChartProps) => {
  const chartData = data.map((valores, index) => ({
    terno: `${index + 1}º`,
    pressao: valores[0]?.toFixed(1) || 0,
    entrada: valores[1]?.toFixed(1) || 0,
    saida: valores[2]?.toFixed(1) || 0,
  }));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Aberturas por Terno</h3>
        <p className="text-sm text-muted-foreground">
          Faixas típicas: Pressão (300-500mm), Entrada (80-150mm), Saída (40-80mm)
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="terno" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Abertura (mm)', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pressao" 
              stroke="var(--color-pressao)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="entrada" 
              stroke="var(--color-entrada)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="saida" 
              stroke="var(--color-saida)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AberturasChart;