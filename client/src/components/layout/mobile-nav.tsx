import { useState } from "react";
import { Menu, X, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Armchair, 
  Users, 
  UsersRound, 
  Package, 
  BarChart3
} from "lucide-react";

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

export default function MobileNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden bg-white shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Utensils className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-dark-brown">Las Tortilhas</h1>
      </div>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="p-4">
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
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
