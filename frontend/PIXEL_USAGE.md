# Meta Pixel Integration Guide

## Overview
This project supports multiple Meta (Facebook) Pixels with automatic initialization and easy-to-use tracking hooks. All pixels configured in the admin panel will automatically track events across the entire application.

## Setup Complete ✅
- ✅ `react-facebook-pixel` package installed
- ✅ `PixelProvider` integrated in root layout
- ✅ `useMetaPixel` hook available for all components
- ✅ Multi-pixel support enabled

## How It Works
1. Pixels are fetched from the backend API (`/api/pixels`)
2. All pixels are automatically initialized on app load
3. Any event tracked will be sent to ALL configured pixels
4. No manual configuration needed - just add pixels in the admin panel

## Basic Usage

### 1. Import the Hook
```tsx
import { useMetaPixel } from '@/hooks/useMetaPixel';
```

### 2. Use in Your Component

#### Example: Product Page with AddToCart
```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';

const ProductPage = ({ product }) => {
  const { trackAddToCart } = useMetaPixel();

  const handleAddToCart = () => {
    trackAddToCart({
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: 'product',
      value: product.price,
      currency: 'DZD'
    });

    // Your add to cart logic...
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

#### Example: View Product Details
```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import { useEffect } from 'react';

const ProductDetails = ({ product }) => {
  const { trackViewContent } = useMetaPixel();

  useEffect(() => {
    // Track when user views product
    trackViewContent({
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: 'product',
      value: product.price,
      currency: 'DZD'
    });
  }, [product.id]);

  return <div>{/* Product details */}</div>;
};
```

#### Example: Checkout Flow
```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';

const CheckoutPage = ({ cartItems, totalValue }) => {
  const { trackInitiateCheckout, trackPurchase } = useMetaPixel();

  const handleInitiateCheckout = () => {
    trackInitiateCheckout({
      content_ids: cartItems.map(item => item.id.toString()),
      contents: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      num_items: cartItems.length,
      value: totalValue,
      currency: 'DZD'
    });
  };

  const handleCompletePurchase = (orderId: string) => {
    trackPurchase({
      content_ids: cartItems.map(item => item.id.toString()),
      contents: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      value: totalValue,
      currency: 'DZD',
      num_items: cartItems.length
    });
  };

  return (
    <div>
      <button onClick={handleInitiateCheckout}>Proceed to Checkout</button>
      <button onClick={() => handleCompletePurchase('ORDER_123')}>
        Complete Purchase
      </button>
    </div>
  );
};
```

#### Example: Search Functionality
```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';

const SearchBar = () => {
  const { trackSearch } = useMetaPixel();

  const handleSearch = (query: string, results: any[]) => {
    trackSearch({
      search_string: query,
      content_ids: results.map(r => r.id.toString())
    });
  };

  return (
    <input
      type="search"
      onChange={(e) => {
        // Perform search
        const results = performSearch(e.target.value);
        handleSearch(e.target.value, results);
      }}
    />
  );
};
```

#### Example: Contact Form
```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';

const ContactForm = () => {
  const { trackContact, trackLead } = useMetaPixel();

  const handleSubmit = async (formData: any) => {
    // Track contact event
    trackContact();

    // Or track as lead
    trackLead({
      content_name: 'Contact Form Submission',
      value: 0,
      currency: 'DZD'
    });

    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## Available Methods

### Core Methods
- `track(eventName: string, data?: any)` - Track any custom event
- `pageView()` - Track page views

### Helper Methods (Standard Facebook Events)
- `trackViewContent(data)` - User views product/content
- `trackAddToCart(data)` - User adds item to cart
- `trackInitiateCheckout(data)` - User starts checkout
- `trackPurchase(data)` - User completes purchase
- `trackSearch(data)` - User performs search
- `trackAddToWishlist(data)` - User adds to wishlist
- `trackContact()` - User submits contact form
- `trackLead(data)` - User becomes a lead

### Utility Properties
- `isReady: boolean` - Check if pixels are initialized
- `pixels: Pixel[]` - Get list of active pixels

## Custom Events

You can track custom events using the `track` method:

```tsx
const { track } = useMetaPixel();

// Custom event
track('CustomEventName', {
  custom_property: 'value',
  another_property: 123
});
```

## Standard Event Parameters

### ViewContent / AddToCart / AddToWishlist
```tsx
{
  content_name: string;      // Product name
  content_ids: string[];     // Product IDs
  content_type: string;      // 'product', 'product_group'
  value: number;             // Product value
  currency: string;          // 'DZD', 'USD', etc.
}
```

### InitiateCheckout
```tsx
{
  content_ids: string[];     // Product IDs
  contents: Array<{          // Products in cart
    id: string;
    quantity: number;
  }>;
  num_items: number;         // Total items
  value: number;             // Total value
  currency: string;          // 'DZD', 'USD', etc.
}
```

### Purchase
```tsx
{
  content_ids: string[];     // Product IDs
  contents: Array<{          // Purchased products
    id: string;
    quantity: number;
  }>;
  value: number;             // Total purchase value (required)
  currency: string;          // 'DZD', 'USD', etc. (required)
  num_items: number;         // Total items
}
```

### Search
```tsx
{
  search_string: string;     // Search query
  content_ids: string[];     // Result IDs (optional)
}
```

## Debugging

In development mode, pixel events are logged to the console:

```
✅ Initialized 2 Meta Pixel(s): Facebook Pixel, TikTok Pixel
📊 Tracked "AddToCart" on 2 pixel(s) { content_name: "Product Name", ... }
👁️ Page view tracked on 2 pixel(s)
```

## Managing Pixels

Add, edit, or remove pixels through the admin panel:
- Navigate to `/admin/pixels`
- Add your Meta Pixel ID and name
- Pixels will automatically be loaded on next page refresh

## Notes

- All pixels track events simultaneously
- Events are tracked client-side only
- Pixel IDs should be obtained from Meta Business Manager
- The first pixel in the database is set as the primary pixel
- Console logs are only shown in development mode

## Best Practices

1. **Track at the right moment**: Call tracking functions when the action actually occurs
2. **Include relevant data**: More data = better optimization for Meta
3. **Use standard events**: Stick to Meta's standard events when possible
4. **Test thoroughly**: Check Meta Events Manager to verify tracking
5. **Currency consistency**: Always use the same currency (DZD for Algeria)

## Troubleshooting

### Pixels not tracking?
1. Check browser console for initialization logs
2. Verify pixels are added in admin panel (`/admin/pixels`)
3. Check Meta Events Manager for received events
4. Ensure ad blockers are disabled during testing

### Multiple tracking calls?
- This is normal if you have multiple pixels configured
- Each pixel receives the same event

## Example: Full E-commerce Flow

```tsx
'use client';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import { useEffect } from 'react';

const ProductFlow = ({ product }) => {
  const {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase
  } = useMetaPixel();

  // Track product view on mount
  useEffect(() => {
    trackViewContent({
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'DZD'
    });
  }, [product.id]);

  const handleAddToCart = () => {
    trackAddToCart({
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'DZD'
    });
  };

  const handleCheckout = () => {
    trackInitiateCheckout({
      content_ids: [product.id],
      contents: [{ id: product.id, quantity: 1 }],
      num_items: 1,
      value: product.price,
      currency: 'DZD'
    });
  };

  const handlePurchase = () => {
    trackPurchase({
      content_ids: [product.id],
      contents: [{ id: product.id, quantity: 1 }],
      value: product.price,
      currency: 'DZD',
      num_items: 1
    });
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={handlePurchase}>Complete Purchase</button>
    </div>
  );
};
```

---

For more information, visit [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
