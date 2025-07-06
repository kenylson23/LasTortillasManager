import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Charts() {
  const { data: weeklySales, isLoading: isLoadingWeeklySales } = useQuery({
    queryKey: ["/api/dashboard/weekly-sales"],
    retry: false,
  });

  const { data: popularDishes, isLoading: isLoadingPopularDishes } = useQuery({
    queryKey: ["/api/dashboard/popular-dishes"],
    retry: false,
  });

  // Transform weekly sales data for chart
  const salesData = weeklySales?.map((item: any) => ({
    day: new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
    sales: Number(item.sales) || 0
  })) || [];

  // Transform popular dishes data for pie chart
  const dishesData = popularDishes?.map((dish: any, index: number) => ({
    name: dish.name,
    value: dish.count,
    fill: `hsl(${24 + index * 45}, 74%, ${47 + index * 10}%)`
  })) || [];

  const COLORS = [
    'hsl(24, 74%, 47%)',   // primary
    'hsl(35, 69%, 50%)',   // secondary
    'hsl(9, 100%, 60%)',   // accent
    'hsl(45, 100%, 70%)',  // yellow
    'hsl(15, 85%, 65%)',   // orange
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-dark-brown">Vendas da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingWeeklySales ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Vendas']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(24, 74%, 47%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(24, 74%, 47%)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-dark-brown">Pratos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPopularDishes ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dishesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dishesData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
