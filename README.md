# NutriClay 🏺

> **High-Fidelity Ceramic Nutrition & Macronutrient Tracking Architecture**  
> Engineered with tactile digital clay physics, the Mifflin-St Jeor metabolic calculation engine, multi-modal food logging, and real-time kinetic energy budgeting.

**Live Deployment**: [https://nutriclay-ten.vercel.app](https://nutriclay-ten.vercel.app)

---

## 🌟 Highlights

- **Digital Clay Aesthetic (Claymorphism v2.4)**: Warm studio porcelain canvas (`#F7F5F0`), terracotta coral (`#FF5A36`), tangerine (`#FF8A00`), emerald (`#10B981`), and mineral cobalt (`#2563EB`) with 4-layer soft specular lighting and squishable button physics.
- **Dynamic Target Engine**: Calibrates Basal Metabolic Rate (BMR) via the **Mifflin-St Jeor** equation:
  - $\text{BMR}_{\text{Men}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$
  - $\text{BMR}_{\text{Women}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$
  - $\text{TDEE} = \text{BMR} \times \text{Activity Multiplier}$
- **Adaptive Macro Splitter**: Automatically divides adjusted daily calories into targets for Protein (4 kcal/g), Carbohydrates (4 kcal/g), and Fats (9 kcal/g).
- **Multi-Modal Food Ingestion**:
  1. *Universal Food Search* backed by an embedded database.
  2. *UPC / EAN Barcode Scanner* emulation.
  3. *Quick Log Engine* for instant manual macro entry.
  4. *Custom Composite Recipe Builder* with per-serving nutrition calculation.
- **5-Compartment Bento Ledger**: Breakfast, Lunch, Dinner, Pre/Post Workout Fuel, and Mindful Snacks.
- **Tactile Hydration Station**: 10-cup interactive glass ledger tracking 250ml precision increments with 1-click pills.
- **Zero Ad Bloat & Client-Side Privacy**: Embedded relational database powered by `node:sqlite`.

---

## 🚀 Routes & Pages

- **`/`**: High-converting Marketing Landing Page featuring core architecture bento, interactive on-page metabolic calculator, comparison tables, and athlete testimonials.
- **`/login`**: High-fidelity claymorphic authentication portal with 1-click demo access for instant test-driving.
- **`/app`**: Full interactive NutriClay Studio Tracker with real-time 36-tick ceramic orb meter and 5 bento compartments.
- **`/dashboard`**: Direct route alias redirecting to `/app`.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom digital clay shadow utilities
- **Database**: Embedded SQLite via Node.js native `node:sqlite`
- **Icons**: Lucide React

---

## 💻 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/dakshgr8/nutriclay.git
cd nutriclay

# Install dependencies
pnpm install

# Run the development server
pnpm dev --port 3005

# Or build for production
pnpm build
pnpm start --port 3005
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 📄 License

MIT © 2026 NutriClay.
