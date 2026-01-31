# Thanglish to Tamil Testing - Quick Guide

**Assignment 1 - IT3040 ITPM**  
**Registration Number:** `<Your_Registration_Number>`

---

## 🚀 Quick Setup (3 Commands)

```bash
cd <project-folder>
npm install
npx playwright test
```

---

## 📦 Requirements

- Node.js v16+ ([download](https://nodejs.org/))
- npm v7+ (included with Node.js)

```bash
node --version  # Check Node.js
npm --version   # Check npm
```

---

## 🎯 Running Tests

### Terminal Method

```bash
npx playwright test              # Run all tests
npx playwright test --headed     # See browser
npx playwright show-report       # View results
```

### VS Code Method (Recommended)

#### 1. Install Extension

- Open Extensions (`Ctrl+Shift+X`)
- Search: **"Playwright Test for VSCode"**
- Install the **Microsoft** extension (official)

#### 2. Watch Tests in Browser

**What you'll see:**

- **🧪 Testing icon** (beaker/flask) appears in left sidebar
- Click it to open Test Explorer
- Each test has a **▶️ green triangle** on the left side
- Click any triangle to run that specific test

**Step-by-step to watch:**

1. Click **🧪 Testing** icon (left sidebar - looks like beaker/flask)
2. See all tests with **▶️ green play triangles** on the left
3. At bottom: Select **Chromium** browser
4. Click **⚙️ Settings** → Enable **"Show browser"** ✓
5. Click any **▶️ triangle** next to a test name
6. **Watch browser execute that test live!**

**Visual Guide:**
```
Sidebar:           Test Explorer:
  🧪 Testing  →    tests/
  (click this)     ├─ ▶️ test-file.spec.ts
                   │  ├─ ▶️ Test 1
                   │  ├─ ▶️ Test 2  ← Click triangle!
                   │  └─ ▶️ Test 3
```

**Pro Tip:** Click individual **▶️ triangles** to watch one test at a time. Running all tests in parallel is too fast to observe!

---

## 🔧 Troubleshooting

```bash
# Browsers not installed?
npx playwright install

# Dependencies broken?
rm -rf node_modules package-lock.json
npm install

# Check versions
npx playwright --version
```

---

## 📊 Project Info

- **Tests:** 35+ (24 positive, 10 negative, 1 UI)
- **URL:** https://tamil.changathi.com/
- **Duration:** ~5-10 minutes
- **Internet Required:** Yes

---

## 📁 Project Structure

```
tests/
├── positive-functional/  # 24+ tests
├── negative-functional/  # 10+ tests
└── ui-tests/            # 1 test
```

---

## 💡 Key Points

✅ **🧪 Testing icon** = beaker/flask in left sidebar  
✅ **▶️ Green triangles** = appear on left of each test (click to run)  
✅ Use VS Code extension to **watch tests in browser**  
✅ Select **Chromium** and enable **"Show browser"**  
✅ Run **individual tests** (click ▶️ triangle) for better observation  
✅ Check internet connection before running  
✅ HTML report auto-generated after tests  

---

**Full Documentation:** See detailed README.md

**Playwright Docs:** https://playwright.dev/docs/intro
