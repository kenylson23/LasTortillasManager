import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Utensils, 
  Armchair, 
  Users, 
  UsersRound, 
  Package, 
  BarChart3,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pedidos", href: "/orders", icon: Receipt },
  { name: "Cardápio", href: "/menu", icon: Utensils },
  { name: "Mesas", href: "/tables", icon: Armchair },
  { name: "Funcionários", href: "/staff", icon: Users },
  { name: "Clientes", href: "/customers", icon: UsersRound },
  { name: "Estoque", href: "/inventory", icon: Package },
  { name: "Relatórios", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="bg-white shadow-lg w-64 flex-shrink-0 hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark-brown">Las Tortilhas</h1>
            <p className="text-sm text-gray-600">Gestão</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-dark-brown hover:bg-light-brown"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-6 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-dark-brown">
              {user?.firstName || "Usuário"}
            </p>
            <p className="text-sm text-gray-600">Gerente</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
