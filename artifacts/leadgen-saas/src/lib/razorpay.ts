// Load Razorpay script dynamically
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

export async function showRazorpayCheckout(options: {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}): Promise<void> {
  await loadRazorpayScript();
  
  const razorpayObject = new (window as any).Razorpay({
    key: options.key,
    amount: options.amount,
    currency: options.currency,
    name: options.name,
    description: options.description,
    image: options.image,
    order_id: options.order_id,
    handler: options.handler,
    prefill: options.prefill,
    notes: options.notes,
    theme: options.theme,
  });
  
  razorpayObject.open();
}

// UPI Payment Functions
export async function createUPIOrder(options: {
  planId: number;
  upiId?: string; // Optional: pre-filled UPI ID for user
}): Promise<any> {
  const response = await fetch('/api/payments/create-upi-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId: options.planId, upiId: options.upiId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create UPI payment order');
  }
  
  return response.json();
}

export async function showUPIPaymentOptions(options: {
  amount: number;
  currency: string;
  orderId: string;
  upiData: {
    qrCode?: string;
    intentUrl?: string;
    vpa?: string;
  };
  onPaymentSuccess: () => Promise<void>;
  onPaymentError: (error: any) => void;
}): Promise<void> {
  // Show UPI payment modal with QR code and instructions
  // In a real implementation, this would be a proper modal component
  // For now, we'll use console.log to simulate showing UPI options
  // In a production app, this would show a modal with QR code display
  
  console.log('UPI Payment Options:', {
    amount: options.amount,
    currency: options.currency,
    orderId: options.orderId,
    upiData: options.upiData
  });
  
  // For this implementation, we'll rely on the user completing payment
  // and the webhook updating the backend, which will be reflected on page refresh
  // or the user can manually refresh to check status
  
  // Simulate showing the UPI options and wait for user action
  return new Promise((resolve) => {
    // In a real app, this would show a modal and wait for user interaction
    // For now, we'll just resolve immediately and let the user handle payment externally
    resolve();
  });
}
