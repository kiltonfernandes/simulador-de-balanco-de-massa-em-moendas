import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PressoesChartProps {
  data: number[][];
}

const chartConfig = {
  hidraulica: {
    label: "Hidráulica (psi)",
    color: "hsl(var(--primary))",
  },
  mancal: {
    label: "Mancal (psi)",
    color: "hsl(var(--accent))",
  },
  nitrogenio: {
    label: "Nitrogênio (psi)",
    color: "hsl(var(--secondary))",
  },
};

const PressoesChart = ({ data }: PressoesChartProps) => {
  const chartData = data.map((valores, index) => ({
    terno: `${index + 1}º`,
    hidraulica: valores[0]?.toFixed(0) || 0,
    mancal: valores[1]?.toFixed(0) || 0,
    nitrogenio: valores[2]?.toFixed(0) || 0,
  }));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Pressões por Terno</h3>
        <p className="text-sm text-muted-foreground">
          Faixas típicas: Hidráulica (800-2000psi), Mancal (100-400psi), Nitrogênio (900-2200psi)
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="terno" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Pressão (psi)', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey="hidraulica" 
              fill="var(--color-hidraulica)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="mancal" 
              fill="var(--color-mancal)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="nitrogenio" 
              fill="var(--color-nitrogenio)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PressoesChart;