from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class UserPreferences(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    country: str
    language: str
    currency: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class UserPreferencesCreate(BaseModel):
    country: str
    language: str
    currency: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    currency: str = "USD"
    category: str
    image_url: str
    trending_score: int = 0
    country_availability: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    currency: str = "USD"
    category: str
    image_url: str
    trending_score: int = 0
    country_availability: List[str] = []

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    quantity: int = 1
    added_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemCreate(BaseModel):
    user_id: str
    product_id: str
    quantity: int = 1

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    country: str
    language: str
    currency: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    name: str
    country: str
    language: str
    currency: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Trendly API!"}

@api_router.post("/user-preferences", response_model=UserPreferences)
async def save_user_preferences(input: UserPreferencesCreate):
    preferences_dict = input.dict()
    preferences_obj = UserPreferences(**preferences_dict)
    await db.user_preferences.insert_one(preferences_obj.dict())
    return preferences_obj

@api_router.get("/countries")
async def get_countries():
    return {
        "countries": [
            # Major markets
            {"code": "US", "name": "United States", "currency": "USD", "flag": "🇺🇸"},
            {"code": "CA", "name": "Canada", "currency": "CAD", "flag": "🇨🇦"},
            {"code": "GB", "name": "United Kingdom", "currency": "GBP", "flag": "🇬🇧"},
            {"code": "AU", "name": "Australia", "currency": "AUD", "flag": "🇦🇺"},
            
            # European Union
            {"code": "FR", "name": "France", "currency": "EUR", "flag": "🇫🇷"},
            {"code": "DE", "name": "Germany", "currency": "EUR", "flag": "🇩🇪"},
            {"code": "ES", "name": "Spain", "currency": "EUR", "flag": "🇪🇸"},
            {"code": "IT", "name": "Italy", "currency": "EUR", "flag": "🇮🇹"},
            {"code": "NL", "name": "Netherlands", "currency": "EUR", "flag": "🇳🇱"},
            {"code": "BE", "name": "Belgium", "currency": "EUR", "flag": "🇧🇪"},
            {"code": "AT", "name": "Austria", "currency": "EUR", "flag": "🇦🇹"},
            {"code": "PT", "name": "Portugal", "currency": "EUR", "flag": "🇵🇹"},
            {"code": "IE", "name": "Ireland", "currency": "EUR", "flag": "🇮🇪"},
            {"code": "FI", "name": "Finland", "currency": "EUR", "flag": "🇫🇮"},
            {"code": "DK", "name": "Denmark", "currency": "DKK", "flag": "🇩🇰"},
            {"code": "SE", "name": "Sweden", "currency": "SEK", "flag": "🇸🇪"},
            {"code": "NO", "name": "Norway", "currency": "NOK", "flag": "🇳🇴"},
            {"code": "CH", "name": "Switzerland", "currency": "CHF", "flag": "🇨🇭"},
            {"code": "PL", "name": "Poland", "currency": "PLN", "flag": "🇵🇱"},
            {"code": "CZ", "name": "Czech Republic", "currency": "CZK", "flag": "🇨🇿"},
            {"code": "HU", "name": "Hungary", "currency": "HUF", "flag": "🇭🇺"},
            {"code": "SK", "name": "Slovakia", "currency": "EUR", "flag": "🇸🇰"},
            {"code": "SI", "name": "Slovenia", "currency": "EUR", "flag": "🇸🇮"},
            {"code": "HR", "name": "Croatia", "currency": "EUR", "flag": "🇭🇷"},
            {"code": "RO", "name": "Romania", "currency": "RON", "flag": "🇷🇴"},
            {"code": "BG", "name": "Bulgaria", "currency": "BGN", "flag": "🇧🇬"},
            {"code": "GR", "name": "Greece", "currency": "EUR", "flag": "🇬🇷"},
            {"code": "CY", "name": "Cyprus", "currency": "EUR", "flag": "🇨🇾"},
            {"code": "MT", "name": "Malta", "currency": "EUR", "flag": "🇲🇹"},
            {"code": "LU", "name": "Luxembourg", "currency": "EUR", "flag": "🇱🇺"},
            {"code": "EE", "name": "Estonia", "currency": "EUR", "flag": "🇪🇪"},
            {"code": "LV", "name": "Latvia", "currency": "EUR", "flag": "🇱🇻"},
            {"code": "LT", "name": "Lithuania", "currency": "EUR", "flag": "🇱🇹"},
            
            # Asia Pacific
            {"code": "JP", "name": "Japan", "currency": "JPY", "flag": "🇯🇵"},
            {"code": "KR", "name": "South Korea", "currency": "KRW", "flag": "🇰🇷"},
            {"code": "CN", "name": "China", "currency": "CNY", "flag": "🇨🇳"},
            {"code": "HK", "name": "Hong Kong", "currency": "HKD", "flag": "🇭🇰"},
            {"code": "TW", "name": "Taiwan", "currency": "TWD", "flag": "🇹🇼"},
            {"code": "SG", "name": "Singapore", "currency": "SGD", "flag": "🇸🇬"},
            {"code": "MY", "name": "Malaysia", "currency": "MYR", "flag": "🇲🇾"},
            {"code": "TH", "name": "Thailand", "currency": "THB", "flag": "🇹🇭"},
            {"code": "PH", "name": "Philippines", "currency": "PHP", "flag": "🇵🇭"},
            {"code": "ID", "name": "Indonesia", "currency": "IDR", "flag": "🇮🇩"},
            {"code": "VN", "name": "Vietnam", "currency": "VND", "flag": "🇻🇳"},
            {"code": "IN", "name": "India", "currency": "INR", "flag": "🇮🇳"},
            {"code": "PK", "name": "Pakistan", "currency": "PKR", "flag": "🇵🇰"},
            {"code": "BD", "name": "Bangladesh", "currency": "BDT", "flag": "🇧🇩"},
            {"code": "LK", "name": "Sri Lanka", "currency": "LKR", "flag": "🇱🇰"},
            {"code": "NZ", "name": "New Zealand", "currency": "NZD", "flag": "🇳🇿"},
            
            # Americas
            {"code": "MX", "name": "Mexico", "currency": "MXN", "flag": "🇲🇽"},
            {"code": "BR", "name": "Brazil", "currency": "BRL", "flag": "🇧🇷"},
            {"code": "AR", "name": "Argentina", "currency": "ARS", "flag": "🇦🇷"},
            {"code": "CL", "name": "Chile", "currency": "CLP", "flag": "🇨🇱"},
            {"code": "CO", "name": "Colombia", "currency": "COP", "flag": "🇨🇴"},
            {"code": "PE", "name": "Peru", "currency": "PEN", "flag": "🇵🇪"},
            {"code": "UY", "name": "Uruguay", "currency": "UYU", "flag": "🇺🇾"},
            {"code": "PY", "name": "Paraguay", "currency": "PYG", "flag": "🇵🇾"},
            {"code": "BO", "name": "Bolivia", "currency": "BOB", "flag": "🇧🇴"},
            {"code": "EC", "name": "Ecuador", "currency": "USD", "flag": "🇪🇨"},
            {"code": "VE", "name": "Venezuela", "currency": "VES", "flag": "🇻🇪"},
            
            # Middle East
            {"code": "AE", "name": "United Arab Emirates", "currency": "AED", "flag": "🇦🇪"},
            {"code": "SA", "name": "Saudi Arabia", "currency": "SAR", "flag": "🇸🇦"},
            {"code": "QA", "name": "Qatar", "currency": "QAR", "flag": "🇶🇦"},
            {"code": "KW", "name": "Kuwait", "currency": "KWD", "flag": "🇰🇼"},
            {"code": "BH", "name": "Bahrain", "currency": "BHD", "flag": "🇧🇭"},
            {"code": "OM", "name": "Oman", "currency": "OMR", "flag": "🇴🇲"},
            {"code": "JO", "name": "Jordan", "currency": "JOD", "flag": "🇯🇴"},
            {"code": "LB", "name": "Lebanon", "currency": "LBP", "flag": "🇱🇧"},
            {"code": "TR", "name": "Turkey", "currency": "TRY", "flag": "🇹🇷"},
            {"code": "IL", "name": "Israel", "currency": "ILS", "flag": "🇮🇱"},
            
            # Africa
            {"code": "ZA", "name": "South Africa", "currency": "ZAR", "flag": "🇿🇦"},
            {"code": "EG", "name": "Egypt", "currency": "EGP", "flag": "🇪🇬"},
            {"code": "MA", "name": "Morocco", "currency": "MAD", "flag": "🇲🇦"},
            {"code": "TN", "name": "Tunisia", "currency": "TND", "flag": "🇹🇳"},
            {"code": "DZ", "name": "Algeria", "currency": "DZD", "flag": "🇩🇿"},
            {"code": "NG", "name": "Nigeria", "currency": "NGN", "flag": "🇳🇬"},
            {"code": "KE", "name": "Kenya", "currency": "KES", "flag": "🇰🇪"},
            {"code": "GH", "name": "Ghana", "currency": "GHS", "flag": "🇬🇭"},
            
            # Others
            {"code": "RU", "name": "Russia", "currency": "RUB", "flag": "🇷🇺"},
            {"code": "UA", "name": "Ukraine", "currency": "UAH", "flag": "🇺🇦"},
            {"code": "BY", "name": "Belarus", "currency": "BYN", "flag": "🇧🇾"},
            {"code": "KZ", "name": "Kazakhstan", "currency": "KZT", "flag": "🇰🇿"},
            {"code": "UZ", "name": "Uzbekistan", "currency": "UZS", "flag": "🇺🇿"},
            {"code": "AM", "name": "Armenia", "currency": "AMD", "flag": "🇦🇲"},
            {"code": "GE", "name": "Georgia", "currency": "GEL", "flag": "🇬🇪"},
            {"code": "AZ", "name": "Azerbaijan", "currency": "AZN", "flag": "🇦🇿"},
            {"code": "MD", "name": "Moldova", "currency": "MDL", "flag": "🇲🇩"},
            {"code": "RS", "name": "Serbia", "currency": "RSD", "flag": "🇷🇸"},
            {"code": "BA", "name": "Bosnia and Herzegovina", "currency": "BAM", "flag": "🇧🇦"},
            {"code": "ME", "name": "Montenegro", "currency": "EUR", "flag": "🇲🇪"},
            {"code": "MK", "name": "North Macedonia", "currency": "MKD", "flag": "🇲🇰"},
            {"code": "AL", "name": "Albania", "currency": "ALL", "flag": "🇦🇱"},
            {"code": "IS", "name": "Iceland", "currency": "ISK", "flag": "🇮🇸"},
        ]
    }

@api_router.get("/languages")
async def get_languages():
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "fr", "name": "Français"},
            {"code": "es", "name": "Español"},
            {"code": "de", "name": "Deutsch"},
            {"code": "it", "name": "Italiano"},
            {"code": "pt", "name": "Português"},
            {"code": "nl", "name": "Nederlands"},
            {"code": "pl", "name": "Polski"},
            {"code": "ru", "name": "Русский"},
            {"code": "ja", "name": "日本語"},
            {"code": "ko", "name": "한국어"},
            {"code": "zh", "name": "中文"},
            {"code": "ar", "name": "العربية"},
            {"code": "tr", "name": "Türkçe"},
            {"code": "hi", "name": "हिन्दी"},
            {"code": "th", "name": "ไทย"},
            {"code": "vi", "name": "Tiếng Việt"},
            {"code": "id", "name": "Bahasa Indonesia"},
            {"code": "ms", "name": "Bahasa Melayu"},
            {"code": "tl", "name": "Filipino"},
            {"code": "sv", "name": "Svenska"},
            {"code": "da", "name": "Dansk"},
            {"code": "no", "name": "Norsk"},
            {"code": "fi", "name": "Suomi"},
            {"code": "he", "name": "עברית"},
            {"code": "fa", "name": "فارسی"},
            {"code": "ur", "name": "اردو"},
            {"code": "bn", "name": "বাংলা"},
            {"code": "ta", "name": "தமிழ்"},
            {"code": "te", "name": "తెలుగు"},
            {"code": "mr", "name": "मराठी"},
            {"code": "gu", "name": "ગુજરાતી"},
            {"code": "kn", "name": "ಕನ್ನಡ"},
            {"code": "ml", "name": "മലയാളം"},
            {"code": "cs", "name": "Čeština"},
            {"code": "sk", "name": "Slovenčina"},
            {"code": "hu", "name": "Magyar"},
            {"code": "ro", "name": "Română"},
            {"code": "bg", "name": "Български"},
            {"code": "hr", "name": "Hrvatski"},
            {"code": "sr", "name": "Српски"},
            {"code": "sl", "name": "Slovenščina"},
            {"code": "et", "name": "Eesti"},
            {"code": "lv", "name": "Latviešu"},
            {"code": "lt", "name": "Lietuvių"},
            {"code": "el", "name": "Ελληνικά"},
            {"code": "uk", "name": "Українська"},
            {"code": "be", "name": "Беларуская"},
            {"code": "kk", "name": "Қазақша"},
            {"code": "uz", "name": "O'zbek"},
            {"code": "hy", "name": "Հայերեն"},
            {"code": "ka", "name": "ქართული"},
            {"code": "az", "name": "Azərbaycan"},
        ]
    }

@api_router.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "makeup", "name": "MAKEUP & BEAUTY", "color": "bg-gradient-to-br from-pink-500 to-pink-400"},
            {"id": "high-tech", "name": "HIGH TECH", "color": "bg-gradient-to-br from-blue-500 to-cyan-400"},
            {"id": "tiktok-trends", "name": "TIKTOK TRENDS", "color": "bg-gradient-to-br from-purple-500 to-pink-500"},
            {"id": "fashion", "name": "FASHION", "color": "bg-gradient-to-br from-orange-500 to-red-400"},
            {"id": "home-living", "name": "HOME & LIVING", "color": "bg-gradient-to-br from-cyan-500 to-blue-400"},
            {"id": "outdoor-garden", "name": "OUTDOOR & GARDEN", "color": "bg-gradient-to-br from-yellow-500 to-orange-400"},
            {"id": "health-wellness", "name": "HEALTH & WELLNESS", "color": "bg-gradient-to-br from-red-500 to-pink-400"},
            {"id": "sports-fitness", "name": "SPORTS & FITNESS", "color": "bg-gradient-to-br from-orange-500 to-red-400"},
            {"id": "cooking", "name": "COOKING", "color": "bg-gradient-to-br from-yellow-500 to-orange-400"},
        ]
    }

@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_dict = input.dict()
    product_obj = Product(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    country: Optional[str] = "US",
    limit: int = Query(20, le=100)
):
    query = {}
    if category:
        query["category"] = category
    if country:
        query["country_availability"] = {"$in": [country]}
    
    products = await db.products.find(query).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/trending", response_model=List[Product])
async def get_trending_products(
    country: Optional[str] = "US",
    limit: int = Query(10, le=50)
):
    query = {}
    if country:
        query["country_availability"] = {"$in": [country]}
    
    products = await db.products.find(query).sort("trending_score", -1).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/search")
async def search_products(
    q: str = Query(..., min_length=1),
    country: Optional[str] = "US",
    limit: int = Query(20, le=100)
):
    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}}
        ]
    }
    if country:
        query["country_availability"] = {"$in": [country]}
    
    products = await db.products.find(query).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(input: CartItemCreate):
    cart_item_dict = input.dict()
    cart_item_obj = CartItem(**cart_item_dict)
    await db.cart_items.insert_one(cart_item_obj.dict())
    return cart_item_obj

@api_router.get("/cart/{user_id}", response_model=List[CartItem])
async def get_cart_items(user_id: str):
    cart_items = await db.cart_items.find({"user_id": user_id}).to_list(1000)
    return [CartItem(**item) for item in cart_items]

# Initialize sample data
@api_router.post("/init-sample-data")
async def init_sample_data():
    # Sample products
    sample_products = [
        {
            "name": "LED Face Mask Beauty Device",
            "description": "Professional LED light therapy mask for anti-aging and acne treatment",
            "price": 89.99,
            "original_price": 159.99,
            "currency": "USD",
            "category": "makeup",
            "image_url": "https://images.unsplash.com/photo-1647221597996-54f3d0f73809?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2V8ZW58MHx8fGJsdWV8MTc1MzI0MTk2OHww&ixlib=rb-4.1.0&q=85",
            "trending_score": 95,
            "country_availability": ["US", "CA", "GB", "FR", "DE", "AU"]
        },
        {
            "name": "Viral TikTok Phone Ring Light",
            "description": "Portable selfie ring light perfect for TikTok videos and Instagram stories",
            "price": 24.99,
            "original_price": 49.99,
            "currency": "USD",
            "category": "tiktok-trends",
            "image_url": "https://images.unsplash.com/photo-1573164574230-db1d5e960238?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxlY29tbWVyY2V8ZW58MHx8fGJsdWV8MTc1MzI0MTk2OHww&ixlib=rb-4.1.0&q=85",
            "trending_score": 88,
            "country_availability": ["US", "CA", "GB", "FR", "DE", "AU", "JP"]
        },
        {
            "name": "Wireless Charging Pad Pro",
            "description": "Fast wireless charging station compatible with all smartphones",
            "price": 34.99,
            "original_price": 69.99,
            "currency": "USD",
            "category": "high-tech",
            "image_url": "https://images.unsplash.com/photo-1530735038726-a73fd6e6a349?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUzMTQ4NDE3fDA&ixlib=rb-4.1.0&q=85",
            "trending_score": 76,
            "country_availability": ["US", "CA", "GB", "FR", "DE", "IT", "ES", "AU"]
        },
        {
            "name": "Oversized Hoodie - Trendy Style",
            "description": "Comfortable oversized hoodie in premium cotton blend",
            "price": 39.99,
            "original_price": 79.99,
            "currency": "USD",
            "category": "fashion",
            "image_url": "https://images.unsplash.com/photo-1589810635657-232948472d98?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUzMTQ4NDE3fDA&ixlib=rb-4.1.0&q=85",
            "trending_score": 82,
            "country_availability": ["US", "CA", "GB", "FR", "DE", "ES", "IT"]
        },
        {
            "name": "Smart Home Aromatherapy Diffuser",
            "description": "WiFi-enabled essential oil diffuser with app control and mood lighting",
            "price": 49.99,
            "original_price": 99.99,
            "currency": "USD",
            "category": "home",
            "image_url": "https://images.unsplash.com/photo-1606574343065-c5d71e3789ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUzMTQ4NDE3fDA&ixlib=rb-4.1.0&q=85",
            "trending_score": 71,
            "country_availability": ["US", "CA", "GB", "FR", "DE", "AU"]
        }
    ]
    
    for product_data in sample_products:
        product_obj = Product(**product_data)
        await db.products.insert_one(product_obj.dict())
    
    return {"message": f"Initialized {len(sample_products)} sample products"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()