// Water Animation Canvas
class WaterAnimation {
    constructor() {
        this.canvas = document.getElementById('water-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.ripples = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.resize();
        this.initWaves();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initWaves() {
        // Create multiple wave layers for depth
        this.waves = [
            { amplitude: 30, frequency: 0.02, speed: 0.03, offset: 0, color: 'rgba(66, 165, 245, 0.15)' },
            { amplitude: 25, frequency: 0.025, speed: 0.025, offset: 50, color: 'rgba(41, 182, 246, 0.12)' },
            { amplitude: 20, frequency: 0.03, speed: 0.02, offset: 100, color: 'rgba(3, 169, 244, 0.1)' },
            { amplitude: 15, frequency: 0.035, speed: 0.015, offset: 150, color: 'rgba(0, 188, 212, 0.08)' }
        ];
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse move creates ripples
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create ripple on mouse move (throttled)
            if (Math.random() > 0.95) {
                this.createRipple(e.clientX, e.clientY);
            }
        });
        
        // Click creates bigger ripples
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY, 80, 0.3);
        });
    }
    
    createRipple(x, y, maxRadius = 50, opacity = 0.2) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: maxRadius,
            opacity: opacity,
            speed: 2
        });
    }
    
    drawWaves() {
        this.waves.forEach(wave => {
            this.ctx.beginPath();
            this.ctx.fillStyle = wave.color;
            
            // Start from top
            this.ctx.moveTo(0, 0);
            
            // Draw wavy line
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = wave.offset + 
                    Math.sin((x * wave.frequency) + (this.time * wave.speed)) * wave.amplitude +
                    Math.sin((x * wave.frequency * 0.5) + (this.time * wave.speed * 1.5)) * (wave.amplitude * 0.5);
                this.ctx.lineTo(x, y);
            }
            
            // Complete the fill
            this.ctx.lineTo(this.canvas.width, 0);
            this.ctx.closePath();
            this.ctx.fill();
        });
        
        // Draw bottom waves (inverted)
        this.waves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = wave.color;
            
            const bottomOffset = this.canvas.height - wave.offset - 100;
            
            // Start from bottom
            this.ctx.moveTo(0, this.canvas.height);
            
            // Draw wavy line
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = bottomOffset - 
                    Math.sin((x * wave.frequency) + (this.time * wave.speed * 0.8)) * wave.amplitude +
                    Math.sin((x * wave.frequency * 0.7) + (this.time * wave.speed * 1.2)) * (wave.amplitude * 0.5);
                this.ctx.lineTo(x, y);
            }
            
            // Complete the fill
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }
    
    drawRipples() {
        this.ripples = this.ripples.filter(ripple => {
            // Draw ripple
            const currentOpacity = ripple.opacity * (1 - ripple.radius / ripple.maxRadius);
            
            if (currentOpacity > 0.01) {
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(66, 165, 245, ${currentOpacity})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Inner ripple
                if (ripple.radius > 10) {
                    this.ctx.beginPath();
                    this.ctx.arc(ripple.x, ripple.y, ripple.radius - 10, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(3, 169, 244, ${currentOpacity * 0.5})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
                
                // Expand ripple
                ripple.radius += ripple.speed;
                
                return true;
            }
            
            return false;
        });
    }
    
    drawBubbles() {
        // Draw floating bubbles influenced by mouse
        const bubbleCount = 5;
        for (let i = 0; i < bubbleCount; i++) {
            const x = (this.canvas.width / bubbleCount) * i + 
                Math.sin(this.time * 0.02 + i) * 50;
            const y = this.canvas.height * 0.5 + 
                Math.sin(this.time * 0.03 + i * 2) * 100;
            const radius = 3 + Math.sin(this.time * 0.05 + i) * 2;
            
            // Calculate distance from mouse
            const dx = this.mouse.x - x;
            const dy = this.mouse.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Bubble moves away from mouse
            let offsetX = 0;
            let offsetY = 0;
            if (distance < 200) {
                const force = (200 - distance) / 200;
                offsetX = -(dx / distance) * force * 30;
                offsetY = -(dy / distance) * force * 30;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    animate() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(0.5, '#bbdefb');
        gradient.addColorStop(1, '#90caf9');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all elements
        this.drawWaves();
        this.drawBubbles();
        this.drawRipples();
        
        // Increment time
        this.time += 1;
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize water animation when DOM is ready
let waterAnimation;
window.addEventListener('DOMContentLoaded', () => {
    waterAnimation = new WaterAnimation();
});

// Product Database with Enhanced Information
const products = [
    {
        id: 1,
        name: "Osmoseur 5 Étapes Premium",
        type: "osmoseur",
        price: 2500,
        oldPrice: 3000,
        location: ["casablanca", "rabat", "marrakech"],
        waterColor: "blanc",
        description: "Système d'osmose inverse 5 étapes pour une eau ultra pure",
        detailedDescription: "Technologie RO avancée qui élimine jusqu'à 99% des contaminants. Idéal pour une eau de qualité supérieure.",
        features: ["Élimine 99% des contaminants", "Capacité 190L/jour", "5 étapes de filtration", "Installation incluse"],
        specifications: "Dimensions: 38x18x43cm | Pression: 2-5 bar | Certifié NSF",
        badge: "Bestseller",
        rating: 4.8,
        reviews: 156,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e0f7fa' width='200' height='200'/%3E%3Cpath fill='%231976d2' d='M100 40c-5 0-10 2-13 6-3-4-8-6-13-6-8 0-15 7-15 15 0 13 15 26 28 38 13-12 28-25 28-38 0-8-7-15-15-15z'/%3E%3Ccircle fill='%231976d2' cx='100' cy='120' r='25'/%3E%3Crect fill='%231976d2' x='85' y='145' width='30' height='35'/%3E%3C/svg%3E"
    },
    {
        id: 2,
        name: "Osmoseur 7 Étapes Alcalin",
        type: "osmoseur",
        price: 3200,
        oldPrice: 3800,
        location: ["casablanca", "rabat", "fes", "tanger"],
        waterColor: "blanc",
        description: "Osmoseur avancé avec minéralisation alcaline",
        detailedDescription: "Système de filtration premium avec reminéralisation pour un pH optimal et une eau saine.",
        features: ["Reminéralisation alcaline", "pH équilibré 7.5-8.5", "7 étapes de purification", "Réservoir 12L"],
        specifications: "Dimensions: 40x20x45cm | Capacité: 280L/jour | Garantie 3 ans",
        badge: "Premium",
        rating: 4.9,
        reviews: 203,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e1f5fe' width='200' height='200'/%3E%3Cpath fill='%230277bd' d='M100 30l-15 30h30zM100 170l15-30H85z'/%3E%3Ccircle fill='%230277bd' cx='100' cy='100' r='30' opacity='0.7'/%3E%3Ccircle fill='%230277bd' cx='100' cy='100' r='20' opacity='0.5'/%3E%3Ccircle fill='%230277bd' cx='100' cy='100' r='10'/%3E%3C/svg%3E"
    },
    {
        id: 3,
        name: "Filtre à Eau 3 Étapes",
        type: "filtre",
        price: 1200,
        oldPrice: 1500,
        location: ["marrakech", "agadir", "fes"],
        waterColor: "blanc",
        description: "Filtre à eau compact pour éliminer chlore et sédiments",
        detailedDescription: "Système de filtration compact et efficace, parfait pour l'eau du robinet.",
        features: ["Élimine chlore et mauvais goûts", "Filtre sédiments 5µ", "Charbon actif premium", "Facile à installer"],
        specifications: "Dimensions: 28x12x35cm | Débit: 3-4 L/min | Durée: 6-12 mois",
        badge: "Économique",
        rating: 4.6,
        reviews: 89,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e3f2fd' width='200' height='200'/%3E%3Crect fill='%232196f3' x='70' y='40' width='60' height='120' rx='10'/%3E%3Crect fill='%23fff' x='75' y='50' width='50' height='35' rx='5' opacity='0.3'/%3E%3Crect fill='%23fff' x='75' y='92' width='50' height='35' rx='5' opacity='0.3'/%3E%3Crect fill='%23fff' x='75' y='115' width='50' height='35' rx='5' opacity='0.3'/%3E%3C/svg%3E"
    },
    {
        id: 4,
        name: "Filtre Anti-Calcaire",
        type: "filtre",
        price: 1500,
        oldPrice: 1800,
        location: ["casablanca", "rabat", "tanger"],
        waterColor: "blanc",
        description: "Protection contre le calcaire et dépôts minéraux",
        detailedDescription: "Protection efficace de vos appareils électroménagers contre les dépôts de calcaire.",
        features: ["Protège vos appareils", "Réduit le calcaire 95%", "Économise l'énergie", "Cartouche longue durée"],
        specifications: "Capacité: 60000L | Pression max: 8 bar | Installation simple",
        badge: null,
        rating: 4.7,
        reviews: 124,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f8e9' width='200' height='200'/%3E%3Crect fill='%238bc34a' x='60' y='60' width='80' height='80' rx='40'/%3E%3Cpath fill='%23fff' d='M85 85l10 10 20-25' stroke='%23fff' stroke-width='5' fill='none'/%3E%3C/svg%3E"
    },
    {
        id: 5,
        name: "Cartouche Sédiment 5 Microns",
        type: "cartouche",
        price: 80,
        oldPrice: 100,
        location: ["tous"],
        waterColor: "couleur",
        description: "Cartouche de préfiltration pour eau trouble ou colorée",
        detailedDescription: "Filtre les particules en suspension et protège les filtres suivants.",
        features: ["Filtration 5 microns", "Durée: 3-6 mois", "Compatible universel", "Haute capacité rétention"],
        specifications: "Matériau: Polypropylène | Longueur: 25cm | Certifié alimentaire",
        badge: null,
        rating: 4.5,
        reviews: 67,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23fff3e0' width='200' height='200'/%3E%3Crect fill='%23ff9800' x='75' y='30' width='50' height='140' rx='25'/%3E%3Cline x1='75' y1='60' x2='125' y2='60' stroke='%23fff' stroke-width='2'/%3E%3Cline x1='75' y1='90' x2='125' y2='90' stroke='%23fff' stroke-width='2'/%3E%3Cline x1='75' y1='120' x2='125' y2='120' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E"
    },
    {
        id: 6,
        name: "Cartouche Charbon Actif",
        type: "cartouche",
        price: 120,
        oldPrice: 150,
        location: ["tous"],
        waterColor: "blanc",
        description: "Élimine goûts, odeurs et chlore",
        detailedDescription: "Charbon actif de coco pour une absorption maximale des contaminants chimiques.",
        features: ["Charbon de coco premium", "Élimine chlore 99%", "Améliore le goût", "Durée: 6-12 mois"],
        specifications: "Type: GAC/CTO | Capacité: 10000L | Biodégradable",
        badge: "Écologique",
        rating: 4.6,
        reviews: 92,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f3e5f5' width='200' height='200'/%3E%3Crect fill='%239c27b0' x='70' y='30' width='60' height='140' rx='30'/%3E%3Ccircle fill='%23fff' cx='100' cy='70' r='8' opacity='0.3'/%3E%3Ccircle fill='%23fff' cx='100' cy='100' r='8' opacity='0.3'/%3E%3Ccircle fill='%23fff' cx='100' cy='130' r='8' opacity='0.3'/%3E%3C/svg%3E"
    },
    {
        id: 7,
        name: "Membrane Osmose 75 GPD",
        type: "cartouche",
        price: 350,
        oldPrice: 450,
        location: ["casablanca", "rabat", "marrakech", "fes"],
        waterColor: "blanc",
        description: "Membrane haute performance pour osmoseur",
        detailedDescription: "Membrane TFC de qualité professionnelle avec taux de rejet élevé.",
        features: ["Capacité: 280L/jour", "Rejet: 96-98%", "Durée: 24-36 mois", "TDS < 10 ppm"],
        specifications: "Type: TFC | Format: 75 GPD | Pression: 3-6 bar | Made in USA",
        badge: "Qualité Pro",
        rating: 4.9,
        reviews: 145,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e8f5e9' width='200' height='200'/%3E%3Crect fill='%234caf50' x='60' y='50' width='80' height='100' rx='10'/%3E%3Cpath fill='%23fff' d='M75 75h50M75 95h50M75 115h50' stroke='%23fff' stroke-width='3'/%3E%3Ccircle fill='%23ffd700' cx='100' cy='35' r='15'/%3E%3Cpath fill='%23fff' d='M95 30l5 8 5-8z'/%3E%3C/svg%3E"
    },
    {
        id: 8,
        name: "Kit de Nettoyage Complet",
        type: "accessoire",
        price: 200,
        oldPrice: 250,
        location: ["tous"],
        waterColor: "blanc",
        description: "Kit d'entretien pour systèmes de filtration",
        detailedDescription: "Tout ce qu'il faut pour l'entretien optimal de votre système de filtration.",
        features: ["Solution désinfectante", "Brosses de nettoyage", "Joints de rechange", "Guide d'entretien"],
        specifications: "Contenu: 8 pièces | Sécurité alimentaire | Réutilisable",
        badge: "Maintenance",
        rating: 4.7,
        reviews: 78,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23fce4ec' width='200' height='200'/%3E%3Crect fill='%23e91e63' x='50' y='70' width='100' height='80' rx='10'/%3E%3Crect fill='%23c2185b' x='75' y='50' width='50' height='25' rx='5'/%3E%3Ccircle fill='%23fff' cx='80' cy='100' r='8'/%3E%3Crect fill='%23fff' x='100' y='92' width='35' height='16' rx='3'/%3E%3Ccircle fill='%23fff' cx='90' cy='130' r='6'/%3E%3Crect fill='%23fff' x='105' y='125' width='25' height='10' rx='2'/%3E%3C/svg%3E"
    },
    {
        id: 9,
        name: "Robinet Designer Chrome",
        type: "accessoire",
        price: 180,
        oldPrice: 220,
        location: ["casablanca", "rabat", "marrakech"],
        waterColor: "blanc",
        description: "Robinet élégant pour eau filtrée",
        detailedDescription: "Design moderne en acier inoxydable chromé, facile à installer sur votre évier.",
        features: ["Acier inox 304", "Finition chromée", "Installation facile", "Garantie 2 ans"],
        specifications: "Hauteur: 28cm | Bec: 360° rotation | Pression: 1-5 bar",
        badge: "Design",
        rating: 4.8,
        reviews: 112,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Crect fill='%239e9e9e' x='85' y='140' width='30' height='30' rx='5'/%3E%3Crect fill='%23bdbdbd' x='95' y='80' width='10' height='60'/%3E%3Cpath fill='%23757575' d='M95 80 Q80 60 100 40 Q120 60 105 80z'/%3E%3Cellipse fill='%23e3f2fd' cx='100' cy='130' rx='15' ry='8' opacity='0.6'/%3E%3C/svg%3E"
    },
    {
        id: 10,
        name: "Filtre Spécial Eau Colorée",
        type: "filtre",
        price: 1800,
        oldPrice: 2200,
        location: ["fes", "marrakech", "agadir"],
        waterColor: "couleur",
        description: "Solution pour eau trouble, jaune ou brune",
        detailedDescription: "Système spécialisé pour traiter l'eau fortement chargée en fer, manganèse et sédiments.",
        features: ["Élimine fer et manganèse", "Traite eau colorée", "Système 4 étapes", "Régénération auto"],
        specifications: "Capacité: 2000L/jour | Autonomie: 18 mois | Régénération automatique",
        badge: "Spécialisé",
        rating: 4.7,
        reviews: 64,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e0f2f1' width='200' height='200'/%3E%3Cpath fill='%2300bcd4' d='M100 40c-15 0-25 10-25 25 0 20 25 45 25 45s25-25 25-45c0-15-10-25-25-25z'/%3E%3Ccircle fill='%23fff' cx='100' cy='60' r='8' opacity='0.5'/%3E%3Crect fill='%2300bcd4' x='75' y='120' width='50' height='50' rx='25'/%3E%3Cpath fill='%23fff' d='M85 135h30M85 145h30M85 155h30' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E"
    },
    {
        id: 11,
        name: "Osmoseur Compact Sous-Évier",
        type: "osmoseur",
        price: 2800,
        oldPrice: 3300,
        location: ["casablanca", "rabat", "tanger"],
        waterColor: "blanc",
        description: "Design compact pour petits espaces",
        detailedDescription: "Système d'osmose inverse ultra-compact, idéal pour les cuisines avec espace limité.",
        features: ["Design ultra-compact", "Réservoir 8L intégré", "Installation rapide", "6 étapes filtration"],
        specifications: "Dimensions: 32x15x40cm | Capacité: 190L/jour | Silent tech",
        badge: "Compact",
        rating: 4.8,
        reviews: 98,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23ede7f6' width='200' height='200'/%3E%3Crect fill='%23673ab7' x='60' y='50' width='80' height='100' rx='10'/%3E%3Crect fill='%239575cd' x='70' y='65' width='60' height='15' rx='5'/%3E%3Crect fill='%239575cd' x='70' y='90' width='60' height='15' rx='5'/%3E%3Crect fill='%239575cd' x='70' y='115' width='60' height='15' rx='5'/%3E%3Ccircle fill='%23ffd700' cx='125' cy='60' r='10'/%3E%3Ctext x='122' y='65' fill='%23fff' font-size='12'%3E✓%3C/text%3E%3C/svg%3E"
    },
    {
        id: 12,
        name: "Préfiltre Anti-Impuretés",
        type: "filtre",
        price: 900,
        oldPrice: 1100,
        location: ["tous"],
        waterColor: "couleur",
        description: "Premier niveau de filtration pour eau chargée",
        detailedDescription: "Protection essentielle de votre système principal contre les grosses particules et sédiments.",
        features: ["Filtre grosses particules", "Protège équipement", "Facile à nettoyer", "Transparent pour contrôle"],
        specifications: "Maille: 100µ | Débit: 15 L/min | Corps transparent",
        badge: null,
        rating: 4.5,
        reviews: 81,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23fff8e1' width='200' height='200'/%3E%3Crect fill='%23ffc107' x='70' y='60' width='60' height='80' rx='30'/%3E%3Ccircle fill='%23fff' cx='100' cy='80' r='5' opacity='0.5'/%3E%3Ccircle fill='%23fff' cx='90' cy='100' r='5' opacity='0.5'/%3E%3Ccircle fill='%23fff' cx='110' cy='100' r='5' opacity='0.5'/%3E%3Ccircle fill='%23fff' cx='100' cy='120' r='5' opacity='0.5'/%3E%3Cpath fill='%23ff6f00' d='M85 60h30l-15-15z'/%3E%3C/svg%3E"
    }
];

// Shopping Cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupFilters();
    setupCartLink();
    loadCartFromStorage();
});

// Display products
function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.type = product.type;
    card.dataset.waterColor = product.waterColor;
    
    const locationText = product.location.includes('tous') 
        ? 'Tout le Maroc' 
        : product.location.map(loc => capitalize(loc)).join(', ');
    
    const waterColorText = product.waterColor === 'blanc' 
        ? 'Eau Claire/Blanche' 
        : 'Eau Colorée/Trouble';
    
    // Calculate discount percentage
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    // Generate star rating
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '⭐';
    }
    if (hasHalfStar) {
        starsHTML += '⭐';
    }
    
    card.innerHTML = `
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        ${discount > 0 ? `<div class="product-discount">-${discount}%</div>` : ''}
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image-enhanced">
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-type-badge">${capitalize(product.type)}</span>
            
            <div class="product-rating">
                <span class="stars">${starsHTML}</span>
                <span class="rating-value">${product.rating}</span>
                <span class="reviews">(${product.reviews} avis)</span>
            </div>
            
            <p class="product-location">📍 ${locationText}</p>
            <p class="product-description-short">${product.description}</p>
            
            <div class="product-features">
                <strong>Caractéristiques:</strong>
                <ul>
                    ${product.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-water-type">
                <span class="water-icon ${product.waterColor}">💧</span>
                ${waterColorText}
            </div>
            
            <div class="product-specs">
                <small>${product.specifications}</small>
            </div>
            
            <div class="product-price-container">
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice} MAD</span>` : ''}
                <div class="current-price">${product.price} MAD</div>
                ${discount > 0 ? `<span class="savings">Économisez ${product.oldPrice - product.price} MAD</span>` : ''}
            </div>
            
            <button class="btn-add-cart-enhanced" onclick="addToCart(${product.id})">
                <span class="cart-icon">🛒</span>
                Ajouter au Panier
            </button>
            
            <button class="btn-details" onclick="showProductDetails(${product.id})">
                Voir Détails
            </button>
        </div>
    `;
    
    return card;
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <div class="modal-rating">
                        <span>${'⭐'.repeat(Math.floor(product.rating))}</span>
                        <span>${product.rating}/5</span>
                        <span>(${product.reviews} avis)</span>
                    </div>
                    
                    <p class="modal-description">${product.detailedDescription}</p>
                    
                    <div class="modal-features">
                        <h3>Caractéristiques Principales:</h3>
                        <ul>
                            ${product.features.map(f => `<li>✓ ${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-specs">
                        <h3>Spécifications Techniques:</h3>
                        <p>${product.specifications}</p>
                    </div>
                    
                    <div class="modal-safety">
                        <h3>🛡️ Sécurité & Qualité:</h3>
                        <p>✓ Certifié pour usage alimentaire<br>
                        ✓ Conforme aux normes internationales<br>
                        ✓ Garantie constructeur incluse<br>
                        ✓ Installation et SAV disponibles</p>
                    </div>
                    
                    <div class="modal-price-section">
                        ${product.oldPrice ? `<span class="modal-old-price">${product.oldPrice} MAD</span>` : ''}
                        <div class="modal-current-price">${product.price} MAD</div>
                    </div>
                    
                    <button class="btn-add-cart-modal" onclick="addToCart(${product.id}); this.closest('.product-modal').remove();">
                        🛒 Ajouter au Panier - ${product.price} MAD
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Setup filters
function setupFilters() {
    const typeFilter = document.getElementById('type-filter');
    const colorFilter = document.getElementById('color-filter');
    const locationFilter = document.getElementById('location-filter');
    
    [typeFilter, colorFilter, locationFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const colorFilter = document.getElementById('color-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    
    let filteredProducts = products.filter(product => {
        const typeMatch = typeFilter === 'tous' || product.type === typeFilter;
        const colorMatch = colorFilter === 'tous' || product.waterColor === colorFilter;
        const locationMatch = locationFilter === 'tous' || 
                              product.location.includes('tous') || 
                              product.location.includes(locationFilter);
        
        return typeMatch && colorMatch && locationMatch;
    });
    
    displayProducts(filteredProducts);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCartToStorage();
    showNotification(`${product.name} ajouté au panier!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Votre panier est vide</p>';
        cartTotalElement.textContent = '0';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">${item.price * item.quantity} MAD</div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Retirer</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total;
    }
}

// Setup cart link
function setupCartLink() {
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        const cartSection = document.getElementById('panier-details');
        const isHidden = cartSection.style.display === 'none' || cartSection.style.display === '';
        cartSection.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    const checkoutBtn = document.querySelector('.btn-checkout');
    checkoutBtn.addEventListener('click', checkout);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemText = itemCount > 1 ? 'articles' : 'article';
    
    // Show success notification
    showNotification(`✅ Commande confirmée! Total: ${total} MAD (${itemCount} ${itemText}). Nous vous contactons bientôt!`);
    
    // Clear cart after a brief delay to allow user to see the notification
    setTimeout(() => {
        cart = [];
        updateCart();
        saveCartToStorage();
        // Hide cart section
        const cartSection = document.getElementById('panier-details');
        cartSection.style.display = 'none';
    }, 2000);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Longer display time for longer messages
    const displayTime = message.length > 50 ? 3500 : 2000;
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, displayTime);
}

// Storage functions
function saveCartToStorage() {
    localStorage.setItem('eaudumaroc-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('eaudumaroc-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
