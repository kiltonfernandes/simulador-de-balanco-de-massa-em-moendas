import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface VelocidadesChartProps {
  data: number[][];
}

const chartConfig = {
  rotacao: {
    label: "Rotação (rpm)",
    color: "hsl(var(--primary))",
  },
  periferica_media: {
    label: "Periférica Média (m/min)",
    color: "hsl(var(--accent))",
  },
  periferica_pressao: {
    label: "Periférica Pressão (m/min)",
    color: "hsl(var(--secondary))",
  },
};

const VelocidadesChart = ({ data }: VelocidadesChartProps) => {
  const chartData = data.map((valores, index) => ({
    terno: `${index + 1}º`,
    rotacao: valores[0]?.toFixed(1) || 0,
    periferica_media: valores[1]?.toFixed(1) || 0,
    periferica_pressao: valores[2]?.toFixed(1) || 0,
  }));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Velocidades por Terno</h3>
        <p className="text-sm text-muted-foreground">
          Faixas típicas: Rotação (4-8rpm), Periférica (15-35m/min)
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
              label={{ value: 'Velocidade', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rotacao" 
              stroke="var(--color-rotacao)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="periferica_media" 
              stroke="var(--color-periferica_media)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="periferica_pressao" 
              stroke="var(--color-periferica_pressao)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default VelocidadesChart;