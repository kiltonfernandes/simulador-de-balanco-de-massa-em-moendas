import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface EficienciaChartProps {
  data: number[][];
}

const chartConfig = {
  bagaco_th: {
    label: "Bagaço (t/h)",
    color: "hsl(var(--primary))",
  },
  fibra_pct: {
    label: "Fibra (%)",
    color: "hsl(var(--accent))",
  },
  tch_terno: {
    label: "TCH/Terno",
    color: "hsl(var(--secondary))",
  },
};

const EficienciaChart = ({ data }: EficienciaChartProps) => {
  const chartData = data.map((valores, index) => ({
    terno: `${index + 1}º`,
    bagaco_th: valores[0]?.toFixed(1) || 0,
    fibra_pct: valores[1]?.toFixed(1) || 0,
    tch_terno: valores[2]?.toFixed(1) || 0,
  }));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Eficiência e Produtividade</h3>
        <p className="text-sm text-muted-foreground">
          Faixas típicas: Fibra Bagaço (30-52%), TCH/Terno (80-200t/h)
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="terno" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Valores', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="bagaco_th" 
              stackId="1"
              stroke="var(--color-bagaco_th)" 
              fill="var(--color-bagaco_th)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="fibra_pct" 
              stackId="2"
              stroke="var(--color-fibra_pct)" 
              fill="var(--color-fibra_pct)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="tch_terno" 
              stackId="3"
              stroke="var(--color-tch_terno)" 
              fill="var(--color-tch_terno)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default EficienciaChart;