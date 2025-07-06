import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, TrendingUp, Users, Clock } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-warm">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-brown">Las Tortilhas</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão</p>
              </div>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Entrar
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-brown mb-4">
            Gerencie seu restaurante com facilidade
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema completo de gestão para o Las Tortilhas - controle pedidos, mesas, funcionários e muito mais
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-dark-brown mb-2">
                Analytics em Tempo Real
              </h3>
              <p className="text-gray-600">
                Acompanhe vendas, pedidos e performance do restaurante com gráficos interativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-dark-brown mb-2">
                Gestão de Equipe
              </h3>
              <p className="text-gray-600">
                Controle funcionários, turnos e organize sua equipe de forma eficiente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-dark-brown mb-2">
                Gestão de Pedidos
              </h3>
              <p className="text-gray-600">
                Acompanhe pedidos em tempo real desde a criação até a entrega
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-dark-brown mb-4">
            Pronto para começar?
          </h3>
          <p className="text-gray-600 mb-6">
            Acesse o sistema de gestão do Las Tortilhas e tenha controle total do seu negócio
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
}
