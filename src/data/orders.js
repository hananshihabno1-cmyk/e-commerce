// ============================================================
// DENIO SPORTS — Mock Orders & Tracking
// ============================================================

export const mockOrders = [
  {
    id: 'DS-20261001-7842',
    date: '2026-10-01',
    items: [
      { productId: 'denio-pro-match-football', name: 'DENIO Pro Match Football', size: '5', color: 'White/Red', quantity: 1, price: 2499 },
      { productId: 'football-shin-guards', name: 'Football Shin Guards', size: 'M', color: 'Black', quantity: 1, price: 599 },
    ],
    subtotal: 3098,
    delivery: 0,
    discount: 0,
    total: 3098,
    status: 'shipped',
    paymentMethod: 'UPI',
    address: {
      name: 'Hanan Shihab',
      phone: '+91 98765 43210',
      line1: '42, Park View Apartments',
      line2: 'MG Road, Kozhikode',
      city: 'Kozhikode',
      state: 'Kerala',
      pincode: '673001',
    },
    trackingSteps: [
      { status: 'Order Placed', date: '2026-10-01', time: '10:30 AM', description: 'Your order has been placed successfully.', completed: true },
      { status: 'Confirmed', date: '2026-10-01', time: '11:15 AM', description: 'Order confirmed and payment verified.', completed: true },
      { status: 'Packed', date: '2026-10-02', time: '02:45 PM', description: 'Your items have been packed and are ready for dispatch.', completed: true },
      { status: 'Shipped', date: '2026-10-02', time: '06:30 PM', description: 'Package picked up by delivery partner. Tracking ID: DLEX2026100278', completed: true },
      { status: 'Out for Delivery', date: '', time: '', description: 'Package is on the way to your address.', completed: false },
      { status: 'Delivered', date: '', time: '', description: 'Package delivered.', completed: false },
    ],
    estimatedDelivery: '2026-10-05',
  },
  {
    id: 'DS-20260925-3156',
    date: '2026-09-25',
    items: [
      { productId: 'denio-dryfit-sports-tshirt', name: 'DENIO Dry-Fit Sports T-Shirt', size: 'L', color: 'Black', quantity: 2, price: 699 },
      { productId: 'denio-performance-track-pants', name: 'DENIO Performance Track Pants', size: 'L', color: 'Black', quantity: 1, price: 1299 },
    ],
    subtotal: 2697,
    delivery: 49,
    discount: 539,
    total: 2207,
    status: 'delivered',
    paymentMethod: 'Card',
    address: {
      name: 'Hanan Shihab',
      phone: '+91 98765 43210',
      line1: '42, Park View Apartments',
      line2: 'MG Road, Kozhikode',
      city: 'Kozhikode',
      state: 'Kerala',
      pincode: '673001',
    },
    trackingSteps: [
      { status: 'Order Placed', date: '2026-09-25', time: '09:15 AM', description: 'Your order has been placed successfully.', completed: true },
      { status: 'Confirmed', date: '2026-09-25', time: '09:45 AM', description: 'Order confirmed and payment verified.', completed: true },
      { status: 'Packed', date: '2026-09-26', time: '01:00 PM', description: 'Your items have been packed and are ready for dispatch.', completed: true },
      { status: 'Shipped', date: '2026-09-26', time: '05:20 PM', description: 'Package picked up by delivery partner. Tracking ID: DLEX2026092631', completed: true },
      { status: 'Out for Delivery', date: '2026-09-28', time: '08:30 AM', description: 'Package is out for delivery to your address.', completed: true },
      { status: 'Delivered', date: '2026-09-28', time: '02:15 PM', description: 'Package delivered. Signed by: Hanan S.', completed: true },
    ],
    estimatedDelivery: '2026-09-29',
  },
  {
    id: 'DS-20260910-9023',
    date: '2026-09-10',
    items: [
      { productId: 'denio-carbon-pro-badminton-racket', name: 'DENIO Carbon Pro Badminton Racket', size: null, color: 'Black/Red', quantity: 1, price: 2799 },
    ],
    subtotal: 2799,
    delivery: 0,
    discount: 0,
    total: 2799,
    status: 'delivered',
    paymentMethod: 'UPI',
    address: {
      name: 'Hanan Shihab',
      phone: '+91 98765 43210',
      line1: '42, Park View Apartments',
      line2: 'MG Road, Kozhikode',
      city: 'Kozhikode',
      state: 'Kerala',
      pincode: '673001',
    },
    trackingSteps: [
      { status: 'Order Placed', date: '2026-09-10', time: '04:00 PM', description: 'Your order has been placed successfully.', completed: true },
      { status: 'Confirmed', date: '2026-09-10', time: '04:30 PM', description: 'Order confirmed and payment verified.', completed: true },
      { status: 'Packed', date: '2026-09-11', time: '10:15 AM', description: 'Your items have been packed and are ready for dispatch.', completed: true },
      { status: 'Shipped', date: '2026-09-11', time: '04:00 PM', description: 'Package picked up by delivery partner. Tracking ID: DLEX2026091145', completed: true },
      { status: 'Out for Delivery', date: '2026-09-13', time: '09:00 AM', description: 'Package is out for delivery to your address.', completed: true },
      { status: 'Delivered', date: '2026-09-13', time: '01:30 PM', description: 'Package delivered. Signed by: Hanan S.', completed: true },
    ],
    estimatedDelivery: '2026-09-14',
  },
];

let orderCounter = 1000;
export function generateOrderId() {
  orderCounter++;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `DS-${dateStr}-${orderCounter}`;
}

export function getOrderById(orderId) {
  return mockOrders.find((o) => o.id === orderId) || null;
}

export function getStatusColor(status) {
  switch (status) {
    case 'placed': return 'text-blue-600 bg-blue-50';
    case 'confirmed': return 'text-blue-700 bg-blue-50';
    case 'packed': return 'text-indigo-600 bg-indigo-50';
    case 'shipped': return 'text-orange-600 bg-orange-50';
    case 'out-for-delivery': return 'text-amber-600 bg-amber-50';
    case 'delivered': return 'text-green-600 bg-green-50';
    case 'cancelled': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'placed': return 'Order Placed';
    case 'confirmed': return 'Confirmed';
    case 'packed': return 'Packed';
    case 'shipped': return 'Shipped';
    case 'out-for-delivery': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}
