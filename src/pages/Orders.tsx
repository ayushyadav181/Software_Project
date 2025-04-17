
import { Link } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";

// Simulated order data
const orders = [
  {
    id: "ORD-123456",
    date: "2023-04-01",
    total: 45.98,
    status: "Delivered",
    items: [
      { id: 1, title: "The Midnight Library", quantity: 1, price: 15.99 },
      { id: 2, title: "Atomic Habits", quantity: 1, price: 21.99 },
    ],
  },
  {
    id: "ORD-789012",
    date: "2023-03-15",
    total: 32.5,
    status: "Delivered",
    items: [
      { id: 4, title: "Where the Crawdads Sing", quantity: 1, price: 14.50 },
      { id: 5, title: "Educated", quantity: 1, price: 16.75 },
    ],
  },
  {
    id: "ORD-345678",
    date: "2023-02-28",
    total: 19.99,
    status: "Delivered",
    items: [
      { id: 7, title: "Dune", quantity: 1, price: 19.99 },
    ],
  },
];

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <PageTitle title="Orders" />
        <div className="container max-w-screen-xl py-16 text-center">
          <div className="mx-auto max-w-md">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please login to view your orders</h2>
            <p className="mb-8 text-muted-foreground">
              You need to be logged in to access your order history.
            </p>
            <Button asChild>
              <Link to="/login" className="flex items-center gap-2">
                Login to continue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // No orders
  if (orders.length === 0) {
    return (
      <div>
        <PageTitle title="Your Orders" />
        <div className="container max-w-screen-xl py-16 text-center">
          <div className="mx-auto max-w-md">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="mb-8 text-muted-foreground">
              You haven't placed any orders yet. Start exploring our books!
            </p>
            <Button asChild>
              <Link to="/books" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Browse Books
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle title="Your Orders" />
      <div className="container max-w-screen-xl py-8">
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-muted p-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="font-medium">Order {order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <div className="font-medium">${order.total.toFixed(2)}</div>
                    <div className="text-sm text-green-600">{order.status}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 bg-card divide-y">
                {order.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <Link 
                        to={`/book/${item.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                    <div className="text-right">
                      <div>${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 sm:px-6 bg-muted/50 flex justify-between items-center">
                <div>
                  <Button variant="outline" size="sm">
                    View Order Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Button size="sm">Buy Again</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
