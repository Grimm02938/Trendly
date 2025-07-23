#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Trendly Dropshipping Platform
Tests all backend endpoints according to test_result.md requirements
"""

import requests
import json
import uuid
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"
print(f"🔗 Testing backend at: {API_BASE}")

class TrendlyAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = {
            "countries_languages": {"passed": 0, "failed": 0, "details": []},
            "categories": {"passed": 0, "failed": 0, "details": []},
            "product_management": {"passed": 0, "failed": 0, "details": []},
            "user_preferences": {"passed": 0, "failed": 0, "details": []},
            "cart_management": {"passed": 0, "failed": 0, "details": []},
            "sample_data": {"passed": 0, "failed": 0, "details": []}
        }
        self.test_user_id = str(uuid.uuid4())
        self.test_product_ids = []

    def log_test(self, category, test_name, passed, details=""):
        """Log test result"""
        if passed:
            self.test_results[category]["passed"] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results[category]["failed"] += 1
            print(f"❌ {test_name}: {details}")
        
        self.test_results[category]["details"].append({
            "test": test_name,
            "passed": passed,
            "details": details
        })

    def test_countries_api(self):
        """Test /api/countries endpoint"""
        print("\n🌍 Testing Countries API...")
        
        try:
            response = self.session.get(f"{API_BASE}/countries")
            
            if response.status_code != 200:
                self.log_test("countries_languages", "Countries API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            data = response.json()
            
            # Check structure
            if "countries" not in data:
                self.log_test("countries_languages", "Countries API Structure", False, 
                            "Missing 'countries' key")
                return
            
            countries = data["countries"]
            
            # Verify we have countries
            if len(countries) == 0:
                self.log_test("countries_languages", "Countries Data Presence", False, 
                            "No countries returned")
                return
            
            self.log_test("countries_languages", "Countries API Response", True)
            
            # Check required fields and flag emojis
            required_fields = ["code", "name", "currency", "flag"]
            sample_country = countries[0]
            
            missing_fields = [field for field in required_fields if field not in sample_country]
            if missing_fields:
                self.log_test("countries_languages", "Countries Required Fields", False, 
                            f"Missing fields: {missing_fields}")
            else:
                self.log_test("countries_languages", "Countries Required Fields", True)
            
            # Verify flag emojis are present
            flags_present = all("flag" in country and len(country["flag"]) > 0 for country in countries)
            self.log_test("countries_languages", "Countries Flag Emojis", flags_present,
                         "Some countries missing flag emojis" if not flags_present else "")
            
            # Verify proper currency codes
            valid_currencies = ["USD", "CAD", "GBP", "EUR", "AUD", "JPY", "BRL"]
            invalid_currencies = [c["currency"] for c in countries if c["currency"] not in valid_currencies]
            self.log_test("countries_languages", "Countries Currency Codes", len(invalid_currencies) == 0,
                         f"Invalid currencies: {invalid_currencies}" if invalid_currencies else "")
            
            print(f"   📊 Found {len(countries)} countries with proper structure")
            
        except Exception as e:
            self.log_test("countries_languages", "Countries API Response", False, str(e))

    def test_languages_api(self):
        """Test /api/languages endpoint"""
        print("\n🗣️ Testing Languages API...")
        
        try:
            response = self.session.get(f"{API_BASE}/languages")
            
            if response.status_code != 200:
                self.log_test("countries_languages", "Languages API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            data = response.json()
            
            # Check structure
            if "languages" not in data:
                self.log_test("countries_languages", "Languages API Structure", False, 
                            "Missing 'languages' key")
                return
            
            languages = data["languages"]
            
            # Verify we have languages
            if len(languages) == 0:
                self.log_test("countries_languages", "Languages Data Presence", False, 
                            "No languages returned")
                return
            
            self.log_test("countries_languages", "Languages API Response", True)
            
            # Check required fields
            required_fields = ["code", "name"]
            sample_language = languages[0]
            
            missing_fields = [field for field in required_fields if field not in sample_language]
            if missing_fields:
                self.log_test("countries_languages", "Languages Required Fields", False, 
                            f"Missing fields: {missing_fields}")
            else:
                self.log_test("countries_languages", "Languages Required Fields", True)
            
            print(f"   📊 Found {len(languages)} languages with proper structure")
            
        except Exception as e:
            self.log_test("countries_languages", "Languages API Response", False, str(e))

    def test_categories_api(self):
        """Test /api/categories endpoint - NEW 9 CATEGORY STRUCTURE"""
        print("\n📂 Testing Categories API (9 Category Structure)...")
        
        # Expected categories from the review request
        expected_categories = [
            {"id": "makeup", "name": "MAKEUP & BEAUTY"},
            {"id": "high-tech", "name": "HIGH TECH"},
            {"id": "tiktok-trends", "name": "TIKTOK TRENDS"},
            {"id": "fashion", "name": "FASHION"},
            {"id": "home-living", "name": "HOME & LIVING"},
            {"id": "outdoor-garden", "name": "OUTDOOR & GARDEN"},
            {"id": "health-wellness", "name": "HEALTH & WELLNESS"},
            {"id": "sports-fitness", "name": "SPORTS & FITNESS"},
            {"id": "cooking", "name": "COOKING"}
        ]
        
        try:
            response = self.session.get(f"{API_BASE}/categories")
            
            if response.status_code != 200:
                self.log_test("categories", "Categories API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            data = response.json()
            
            # Check structure
            if "categories" not in data:
                self.log_test("categories", "Categories API Structure", False, 
                            "Missing 'categories' key")
                return
            
            categories = data["categories"]
            
            # Verify exactly 9 categories
            if len(categories) != 9:
                self.log_test("categories", "Categories Count (9 Expected)", False, 
                            f"Expected 9 categories, got {len(categories)}")
            else:
                self.log_test("categories", "Categories Count (9 Expected)", True)
            
            self.log_test("categories", "Categories API Response", True)
            
            # Check required fields for each category
            required_fields = ["id", "name", "color"]
            all_fields_present = True
            missing_field_details = []
            
            for i, category in enumerate(categories):
                missing_fields = [field for field in required_fields if field not in category]
                if missing_fields:
                    all_fields_present = False
                    missing_field_details.append(f"Category {i}: missing {missing_fields}")
            
            self.log_test("categories", "Categories Required Fields", all_fields_present,
                         "; ".join(missing_field_details) if missing_field_details else "")
            
            # Verify expected category IDs and names are present
            actual_categories = {cat["id"]: cat["name"] for cat in categories}
            expected_ids = {cat["id"] for cat in expected_categories}
            actual_ids = set(actual_categories.keys())
            
            missing_ids = expected_ids - actual_ids
            extra_ids = actual_ids - expected_ids
            
            if missing_ids or extra_ids:
                error_msg = []
                if missing_ids:
                    error_msg.append(f"Missing IDs: {missing_ids}")
                if extra_ids:
                    error_msg.append(f"Extra IDs: {extra_ids}")
                self.log_test("categories", "Categories Expected IDs", False, "; ".join(error_msg))
            else:
                self.log_test("categories", "Categories Expected IDs", True)
            
            # Verify category names match expected names
            name_mismatches = []
            for expected_cat in expected_categories:
                cat_id = expected_cat["id"]
                expected_name = expected_cat["name"]
                if cat_id in actual_categories:
                    actual_name = actual_categories[cat_id]
                    if actual_name != expected_name:
                        name_mismatches.append(f"{cat_id}: expected '{expected_name}', got '{actual_name}'")
            
            self.log_test("categories", "Categories Expected Names", len(name_mismatches) == 0,
                         "; ".join(name_mismatches) if name_mismatches else "")
            
            # Verify color field format (should be CSS classes)
            color_format_valid = True
            invalid_colors = []
            
            for category in categories:
                color = category.get("color", "")
                if not color.startswith("bg-gradient-to-br"):
                    color_format_valid = False
                    invalid_colors.append(f"{category.get('id', 'unknown')}: {color}")
            
            self.log_test("categories", "Categories Color Format", color_format_valid,
                         f"Invalid color formats: {invalid_colors}" if invalid_colors else "")
            
            print(f"   📊 Found {len(categories)} categories:")
            for cat in categories:
                print(f"      • {cat.get('id', 'N/A')}: {cat.get('name', 'N/A')}")
            
        except Exception as e:
            self.log_test("categories", "Categories API Response", False, str(e))

    def test_sample_data_initialization(self):
        """Test /api/init-sample-data endpoint"""
        print("\n🔄 Testing Sample Data Initialization...")
        
        try:
            response = self.session.post(f"{API_BASE}/init-sample-data")
            
            if response.status_code != 200:
                self.log_test("sample_data", "Sample Data Init Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            data = response.json()
            
            # Check response structure
            if "message" not in data:
                self.log_test("sample_data", "Sample Data Init Structure", False, 
                            "Missing 'message' key")
                return
            
            self.log_test("sample_data", "Sample Data Init Response", True)
            
            # Verify message indicates products were added
            message = data["message"]
            if "sample products" not in message.lower():
                self.log_test("sample_data", "Sample Data Init Message", False, 
                            f"Unexpected message: {message}")
            else:
                self.log_test("sample_data", "Sample Data Init Message", True)
            
            print(f"   📊 {message}")
            
        except Exception as e:
            self.log_test("sample_data", "Sample Data Init Response", False, str(e))

    def test_products_api(self):
        """Test /api/products endpoint"""
        print("\n📦 Testing Products API...")
        
        try:
            # Test basic products endpoint
            response = self.session.get(f"{API_BASE}/products")
            
            if response.status_code != 200:
                self.log_test("product_management", "Products API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            products = response.json()
            
            if not isinstance(products, list):
                self.log_test("product_management", "Products API Structure", False, 
                            "Response is not a list")
                return
            
            self.log_test("product_management", "Products API Response", True)
            
            if len(products) > 0:
                # Store product IDs for cart testing
                self.test_product_ids = [p["id"] for p in products[:2]]
                
                # Check product structure
                sample_product = products[0]
                required_fields = ["id", "name", "description", "price", "currency", "category", 
                                 "image_url", "trending_score", "country_availability"]
                
                missing_fields = [field for field in required_fields if field not in sample_product]
                if missing_fields:
                    self.log_test("product_management", "Products Required Fields", False, 
                                f"Missing fields: {missing_fields}")
                else:
                    self.log_test("product_management", "Products Required Fields", True)
                
                # Test country filtering
                response = self.session.get(f"{API_BASE}/products?country=US")
                if response.status_code == 200:
                    us_products = response.json()
                    # Verify products have US in country_availability
                    valid_country_filter = all("US" in p.get("country_availability", []) for p in us_products)
                    self.log_test("product_management", "Products Country Filtering", valid_country_filter,
                                "Some products don't have US in country_availability" if not valid_country_filter else "")
                else:
                    self.log_test("product_management", "Products Country Filtering", False, 
                                f"Country filter failed: {response.status_code}")
            else:
                self.log_test("product_management", "Products Data Presence", False, 
                            "No products returned - may need sample data initialization")
            
            print(f"   📊 Found {len(products)} products")
            
        except Exception as e:
            self.log_test("product_management", "Products API Response", False, str(e))

    def test_trending_products_api(self):
        """Test /api/products/trending endpoint"""
        print("\n🔥 Testing Trending Products API...")
        
        try:
            response = self.session.get(f"{API_BASE}/products/trending")
            
            if response.status_code != 200:
                self.log_test("product_management", "Trending Products API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            products = response.json()
            
            if not isinstance(products, list):
                self.log_test("product_management", "Trending Products API Structure", False, 
                            "Response is not a list")
                return
            
            self.log_test("product_management", "Trending Products API Response", True)
            
            if len(products) > 1:
                # Verify products are sorted by trending_score (descending)
                trending_scores = [p.get("trending_score", 0) for p in products]
                is_sorted = all(trending_scores[i] >= trending_scores[i+1] for i in range(len(trending_scores)-1))
                self.log_test("product_management", "Trending Products Sorting", is_sorted,
                            "Products not sorted by trending_score descending" if not is_sorted else "")
            else:
                self.log_test("product_management", "Trending Products Sorting", True, 
                            "Not enough products to verify sorting")
            
            print(f"   📊 Found {len(products)} trending products")
            
        except Exception as e:
            self.log_test("product_management", "Trending Products API Response", False, str(e))

    def test_product_search_api(self):
        """Test /api/products/search endpoint"""
        print("\n🔍 Testing Product Search API...")
        
        try:
            # Test search with a common term
            search_term = "LED"
            response = self.session.get(f"{API_BASE}/products/search?q={search_term}")
            
            if response.status_code != 200:
                self.log_test("product_management", "Product Search API Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            products = response.json()
            
            if not isinstance(products, list):
                self.log_test("product_management", "Product Search API Structure", False, 
                            "Response is not a list")
                return
            
            self.log_test("product_management", "Product Search API Response", True)
            
            # Test partial matching
            if len(products) > 0:
                # Check if search term appears in name, description, or category
                search_matches = []
                for product in products:
                    name_match = search_term.lower() in product.get("name", "").lower()
                    desc_match = search_term.lower() in product.get("description", "").lower()
                    cat_match = search_term.lower() in product.get("category", "").lower()
                    if name_match or desc_match or cat_match:
                        search_matches.append(product)
                
                partial_match_works = len(search_matches) > 0
                self.log_test("product_management", "Product Search Partial Matching", partial_match_works,
                            "Search doesn't return relevant results" if not partial_match_works else "")
            else:
                # Try a more generic search
                response = self.session.get(f"{API_BASE}/products/search?q=a")
                if response.status_code == 200:
                    generic_products = response.json()
                    self.log_test("product_management", "Product Search Functionality", len(generic_products) > 0,
                                "Search returns no results even for generic terms")
                else:
                    self.log_test("product_management", "Product Search Functionality", False, 
                                "Generic search failed")
            
            print(f"   📊 Search for '{search_term}' returned {len(products)} products")
            
        except Exception as e:
            self.log_test("product_management", "Product Search API Response", False, str(e))

    def test_user_preferences_api(self):
        """Test /api/user-preferences endpoint"""
        print("\n👤 Testing User Preferences API...")
        
        try:
            # Test saving user preferences
            preferences_data = {
                "country": "US",
                "language": "en",
                "currency": "USD"
            }
            
            response = self.session.post(f"{API_BASE}/user-preferences", 
                                       json=preferences_data)
            
            if response.status_code != 200:
                self.log_test("user_preferences", "User Preferences Save Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            saved_prefs = response.json()
            
            # Check response structure
            required_fields = ["id", "country", "language", "currency", "timestamp"]
            missing_fields = [field for field in required_fields if field not in saved_prefs]
            
            if missing_fields:
                self.log_test("user_preferences", "User Preferences Response Structure", False, 
                            f"Missing fields: {missing_fields}")
            else:
                self.log_test("user_preferences", "User Preferences Response Structure", True)
            
            # Verify saved data matches input
            data_matches = (
                saved_prefs.get("country") == preferences_data["country"] and
                saved_prefs.get("language") == preferences_data["language"] and
                saved_prefs.get("currency") == preferences_data["currency"]
            )
            
            self.log_test("user_preferences", "User Preferences Data Integrity", data_matches,
                         "Saved preferences don't match input data" if not data_matches else "")
            
            # Verify UUID format for ID
            try:
                uuid.UUID(saved_prefs.get("id", ""))
                self.log_test("user_preferences", "User Preferences UUID Format", True)
            except ValueError:
                self.log_test("user_preferences", "User Preferences UUID Format", False, 
                            "ID is not a valid UUID")
            
            print(f"   📊 Saved preferences with ID: {saved_prefs.get('id', 'N/A')}")
            
        except Exception as e:
            self.log_test("user_preferences", "User Preferences Save Response", False, str(e))

    def test_cart_management_api(self):
        """Test /api/cart endpoints"""
        print("\n🛒 Testing Cart Management API...")
        
        if not self.test_product_ids:
            self.log_test("cart_management", "Cart Testing Prerequisites", False, 
                        "No product IDs available for cart testing")
            return
        
        try:
            # Test adding item to cart
            cart_item_data = {
                "user_id": self.test_user_id,
                "product_id": self.test_product_ids[0],
                "quantity": 2
            }
            
            response = self.session.post(f"{API_BASE}/cart", json=cart_item_data)
            
            if response.status_code != 200:
                self.log_test("cart_management", "Add to Cart Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            cart_item = response.json()
            
            # Check response structure
            required_fields = ["id", "user_id", "product_id", "quantity", "added_at"]
            missing_fields = [field for field in required_fields if field not in cart_item]
            
            if missing_fields:
                self.log_test("cart_management", "Add to Cart Response Structure", False, 
                            f"Missing fields: {missing_fields}")
            else:
                self.log_test("cart_management", "Add to Cart Response Structure", True)
            
            # Verify data integrity
            data_matches = (
                cart_item.get("user_id") == cart_item_data["user_id"] and
                cart_item.get("product_id") == cart_item_data["product_id"] and
                cart_item.get("quantity") == cart_item_data["quantity"]
            )
            
            self.log_test("cart_management", "Add to Cart Data Integrity", data_matches,
                         "Cart item data doesn't match input" if not data_matches else "")
            
            # Test retrieving cart items
            response = self.session.get(f"{API_BASE}/cart/{self.test_user_id}")
            
            if response.status_code != 200:
                self.log_test("cart_management", "Get Cart Items Response", False, 
                            f"Status code: {response.status_code}")
                return
            
            cart_items = response.json()
            
            if not isinstance(cart_items, list):
                self.log_test("cart_management", "Get Cart Items Structure", False, 
                            "Response is not a list")
                return
            
            self.log_test("cart_management", "Get Cart Items Response", True)
            
            # Verify cart contains our added item
            added_item_found = any(
                item.get("user_id") == self.test_user_id and 
                item.get("product_id") == self.test_product_ids[0]
                for item in cart_items
            )
            
            self.log_test("cart_management", "Cart Item Retrieval", added_item_found,
                         "Added cart item not found in user's cart" if not added_item_found else "")
            
            print(f"   📊 Cart for user {self.test_user_id} contains {len(cart_items)} items")
            
        except Exception as e:
            self.log_test("cart_management", "Cart Management API", False, str(e))

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Trendly Backend API Tests")
        print("=" * 50)
        
        # Test in order of priority
        self.test_countries_api()
        self.test_languages_api()
        self.test_categories_api()  # NEW: Test the 9 category structure
        self.test_sample_data_initialization()
        self.test_products_api()
        self.test_trending_products_api()
        self.test_product_search_api()
        self.test_user_preferences_api()
        self.test_cart_management_api()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results["passed"]
            failed = results["failed"]
            total_passed += passed
            total_failed += failed
            
            status = "✅" if failed == 0 else "❌"
            print(f"{status} {category.replace('_', ' ').title()}: {passed} passed, {failed} failed")
        
        print("-" * 50)
        print(f"🎯 OVERALL: {total_passed} passed, {total_failed} failed")
        
        if total_failed == 0:
            print("🎉 All backend API tests passed!")
            return True
        else:
            print("⚠️  Some backend API tests failed. Check details above.")
            return False

if __name__ == "__main__":
    tester = TrendlyAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)