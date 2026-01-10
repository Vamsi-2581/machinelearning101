#!/bin/bash

# Performance Check Script
# Runs various checks to ensure optimal performance

echo "🚀 Machine Learning 101 - Performance Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if build exists
if [ ! -d ".output" ]; then
  echo -e "${YELLOW}⚠️  No build found. Running build...${NC}"
  npm run build
  echo ""
fi

# Check bundle sizes
echo "📦 Checking bundle sizes..."
echo ""

if [ -d ".output/public/_nuxt" ]; then
  echo "JavaScript bundles:"
  find .output/public/_nuxt -name "*.js" -type f -exec du -h {} \; | sort -rh | head -10
  echo ""
  
  echo "CSS bundles:"
  find .output/public/_nuxt -name "*.css" -type f -exec du -h {} \; | sort -rh | head -5
  echo ""
  
  # Calculate total size
  total_js=$(find .output/public/_nuxt -name "*.js" -type f -exec du -b {} \; | awk '{sum+=$1} END {print sum}')
  total_css=$(find .output/public/_nuxt -name "*.css" -type f -exec du -b {} \; | awk '{sum+=$1} END {print sum}')
  
  total_js_mb=$(echo "scale=2; $total_js / 1024 / 1024" | bc)
  total_css_mb=$(echo "scale=2; $total_css / 1024 / 1024" | bc)
  
  echo "Total JavaScript: ${total_js_mb}MB"
  echo "Total CSS: ${total_css_mb}MB"
  echo ""
  
  # Check if sizes are within budget
  if (( $(echo "$total_js_mb > 1.0" | bc -l) )); then
    echo -e "${RED}❌ JavaScript bundle exceeds 1MB budget${NC}"
  else
    echo -e "${GREEN}✅ JavaScript bundle within budget${NC}"
  fi
  
  if (( $(echo "$total_css_mb > 0.2" | bc -l) )); then
    echo -e "${YELLOW}⚠️  CSS bundle exceeds 200KB budget${NC}"
  else
    echo -e "${GREEN}✅ CSS bundle within budget${NC}"
  fi
else
  echo -e "${RED}❌ Build output not found${NC}"
fi

echo ""
echo "🔍 Checking for common issues..."
echo ""

# Check for large images
if [ -d "public" ]; then
  large_images=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k)
  if [ -n "$large_images" ]; then
    echo -e "${YELLOW}⚠️  Large images found (>500KB):${NC}"
    echo "$large_images"
    echo ""
  else
    echo -e "${GREEN}✅ No large images found${NC}"
  fi
fi

# Check for unoptimized dependencies
echo ""
echo "📚 Checking dependencies..."
echo ""

# Check if web-vitals is installed
if grep -q "web-vitals" package.json; then
  echo -e "${GREEN}✅ web-vitals installed${NC}"
else
  echo -e "${RED}❌ web-vitals not installed${NC}"
fi

# Check if @nuxt/image is configured
if grep -q "@nuxt/image" package.json; then
  echo -e "${GREEN}✅ @nuxt/image installed${NC}"
else
  echo -e "${YELLOW}⚠️  @nuxt/image not installed${NC}"
fi

# Check if @nuxt/fonts is configured
if grep -q "@nuxt/fonts" package.json; then
  echo -e "${GREEN}✅ @nuxt/fonts installed${NC}"
else
  echo -e "${YELLOW}⚠️  @nuxt/fonts not installed${NC}"
fi

echo ""
echo "📊 Performance Recommendations:"
echo ""
echo "1. Run Lighthouse audit: npx lighthouse http://localhost:3000 --view"
echo "2. Test on real devices and slow networks"
echo "3. Monitor Core Web Vitals in production"
echo "4. Set up performance budgets in CI/CD"
echo "5. Use PageSpeed Insights for field data"
echo ""
echo "🎯 Target Metrics:"
echo "  - LCP: < 2.5s"
echo "  - FID: < 100ms"
echo "  - CLS: < 0.1"
echo "  - Lighthouse Score: > 90"
echo ""
echo "✨ Performance check complete!"
