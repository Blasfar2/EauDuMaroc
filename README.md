# EauDuMaroc - E-commerce Website

An e-commerce website for water filtration systems in Morocco, featuring osmosis systems (osmoseurs) and water filters.

## Features

- **Product Catalog**: Display of various water filtration products including:
  - Osmosis systems (Osmoseurs)
  - Water filters
  - Cartridges
  - Accessories

- **Advanced Filtering**:
  - Filter by product type
  - Filter by water color (white/clear water vs colored water)
  - Filter by location (major Moroccan cities)

- **Morocco-Specific**:
  - All prices in Moroccan Dirhams (MAD)
  - Location-based product availability
  - French language interface
  - Available in: Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir

- **Shopping Cart**:
  - Add products to cart
  - View cart contents
  - Calculate total price
  - Persistent cart using local storage
  - Checkout functionality

- **Responsive Design**:
  - Mobile-friendly layout
  - Works on all devices

## How to Access the Website

### Option 1: Open Directly (Simple)
1. Download or clone this repository
2. Open `index.html` directly in your web browser (double-click the file)
3. The website will run locally in your browser

### Option 2: Run with Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000
```

### Option 3: Deploy Online
Deploy to any static hosting service:
- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop the files
- **Vercel**: Connect your repository
- **Cloudflare Pages**: Connect and deploy

## How to Use the Website

1. Browse the product catalog
2. Use filters to find specific products by type, water color, or location
3. Add items to cart by clicking "Ajouter au Panier"
4. Click on cart icon (🛒) to view items
5. Click "Commander Maintenant" to checkout

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - Interactive functionality and shopping cart

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- Local Storage for cart persistence

## Product Categories

1. **Osmoseurs** - Reverse osmosis water filtration systems
2. **Filtres** - Water filters for various purification needs
3. **Cartouches** - Replacement cartridges and membranes
4. **Accessoires** - Faucets, cleaning kits, and other accessories

## Water Color Types

- **Eau Blanche/Claire** (White/Clear Water) - For standard tap water
- **Eau Colorée/Trouble** (Colored/Turbid Water) - For water with discoloration or sediment