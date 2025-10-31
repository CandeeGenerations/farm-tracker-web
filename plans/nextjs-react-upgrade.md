# Next.js 16, React 19, and Component Library Modernization Plan

**Date**: October 30, 2025
**Last Updated**: October 30, 2025

## Current State

**Framework Versions**:
- Next.js: 15.5.0 → **16.0.1**
- React: 18.3.1 → **19.2.0**
- React DOM: 18.3.1 → **19.2.0**

**Component Libraries** (TO BE REPLACED):
- @headlessui/react: 1.7.19 → **REMOVE** (migrate to shadcn/ui)
- @tremor/react: 3.18.7 → **REMOVE** (migrate to shadcn/ui)
- react-day-picker: 8.10.1 → **REMOVE** (use shadcn date picker)

**Styling**:
- Tailwind CSS: 3.4.17 → **4.1.16**

**Authentication**:
- next-auth: 4.24.13 → **Auth.js v5** (next-auth successor)

## Overview

This is a **major modernization effort** that includes:
1. ✅ Next.js 15 → 16 upgrade (breaking changes)
2. ✅ React 18 → 19 upgrade (breaking changes)
3. ✅ next-auth v4 → Auth.js v5 migration (critical path)
4. ✅ Tailwind CSS v3 → v4 upgrade (breaking changes)
5. ✅ Migration from @headlessui/react to shadcn/ui
6. ✅ Migration from @tremor/react to shadcn/ui
7. ✅ Remove react-day-picker in favor of shadcn date picker

**Estimated Total Effort**: 80-100 hours (2-2.5 weeks for single developer)

## Prerequisites

- [ ] Ensure all current code is committed and working
- [ ] Create feature branch: `feature/nextjs-16-modernization`
- [ ] Backup current `package.json` and `pnpm-lock.yaml`
- [ ] Take screenshots of all UI components for comparison
- [ ] Document all current component behaviors

## Phase 1: Research & Discovery

### 1.1 Component Inventory Audit

**Headless UI Components Found** (12 usages):
- `Dialog` (8 usages) - modals throughout app
- `Listbox` (1 usage) - FormSelect.tsx
- `Switch` (1 usage) - Toggle.tsx
- `Disclosure` (1 usage) - _layout.tsx
- `Menu` (1 usage) - _layout.tsx
- `Transition` (multiple) - animations

**Tremor Components Found** (5 usages):
- `AreaChart` (2 usages) - _ProgressiveChart.tsx, _Chart.tsx
- `BarChart` (1 usage) - _ProfitLossChart.tsx
- `Badge` (1 usage) - animals/index.tsx
- `Tab/TabGroup/TabList/TabPanel/TabPanels` - chart components
- `Title` - chart titles
- SortableTable uses Tremor's Table components

**Date Picker Usage** (1 usage):
- react-day-picker used in date selection

**shadcn/ui Components Needed**:
- Dialog → Dialog component
- Listbox → Select component
- Switch → Switch component
- Disclosure → Accordion/Collapsible component
- Menu → Dropdown Menu component
- Badge → Badge component
- Charts → Recharts-based Chart component
- Tabs → Tabs component
- DatePicker → Calendar + Popover component
- Table → Table component

### 1.2 Breaking Changes Summary

**Next.js 16**:
- ✅ Async Request APIs mandatory (`params`, `cookies()`, `headers()`)
- ✅ Turbopack now default bundler
- ✅ Node.js 20.9+ required (already on 22+)
- ✅ AMP and Runtime Config removed (not used)

**React 19**:
- ✅ `ref` now a regular prop (no more `forwardRef`)
- ✅ New hooks: `useActionState`, `useFormStatus`, `useEffectEvent`
- ✅ Activity component for background rendering

**Tailwind CSS v4**:
- ✅ Import syntax: `@import "tailwindcss"` instead of `@tailwind` directives
- ✅ Config migrated from JS to CSS (`@theme` directive)
- ✅ PostCSS plugin now in `@tailwindcss/postcss` package
- ✅ CLI in `@tailwindcss/cli` package
- ✅ Modern browser requirements (Safari 16.4+, Chrome 111+, Firefox 128+)
- ✅ Deprecated utilities removed
- ✅ Preprocessor support removed (Sass/Less/Stylus)

**Auth.js v5**:
- ✅ Different configuration structure
- ✅ Updated session handling
- ✅ New provider patterns

### 1.3 Risk Assessment

**Critical Risks** 🔴:
1. **Auth.js v5 migration** - Requires careful session/provider refactoring
2. **Tailwind v4 migration** - Complete config rewrite, potential styling breaks
3. **Component library migration** - 17+ components to replace
4. **Chart components** - Complex Tremor charts need Recharts migration
5. **Async Request APIs** - Breaking change in Next.js 16

**High Risks** 🟡:
1. **Table component migration** - SortableTable uses Tremor Table
2. **Modal standardization** - 8 Dialog usages to migrate
3. **Form components** - Select/Switch migration
4. **Type safety** - TypeScript types may need updates
5. **Styling consistency** - Must maintain visual parity

**Medium Risks** 🟢:
1. **Badge component** - Simple migration
2. **Navigation components** - Menu/Disclosure migration
3. **Date picker** - shadcn calendar well-documented
4. **Build performance** - Turbopack should improve (benefit)

## Phase 2: Pre-Migration Preparation

### 2.1 Documentation

- [ ] Screenshot every page in the application
- [ ] Document all component states (hover, active, disabled, error)
- [ ] Export current color palette from Tailwind config
- [ ] Document all custom Tailwind classes
- [ ] List all environment variables

### 2.2 Code Audit

**Search for problematic patterns**:
```bash
cd client

# Find async API usage
grep -r "params\." src/pages/
grep -r "cookies()" src/
grep -r "headers()" src/
grep -r "draftMode()" src/

# Find forwardRef usage
grep -r "forwardRef" src/

# Find Tailwind @tailwind directives
grep -r "@tailwind" src/

# Find custom Tailwind config usage
cat tailwind.config.js

# Find all CSS imports
grep -r "import.*\.css" src/
```

### 2.3 Create Test Checklist

**Authentication**:
- [ ] Login with email
- [ ] Session persistence
- [ ] Protected route access
- [ ] Logout functionality
- [ ] Email header sent to backend

**UI Components**:
- [ ] All modals (8 different modals)
- [ ] Form select dropdowns
- [ ] Toggle switches
- [ ] Navigation menu
- [ ] Disclosure/accordion
- [ ] Badges
- [ ] Tables with sorting
- [ ] Charts (Area, Bar)
- [ ] Tabs in charts
- [ ] Date picker

**Pages**:
- [ ] Home/Dashboard
- [ ] Animals list and CRUD
- [ ] Products list and CRUD
- [ ] Sales list and CRUD
- [ ] Expenses tracking
- [ ] Data import/export

## Phase 3: Migration Strategy

### Recommended Approach: **Staged Migration**

Given the complexity, we'll break this into manageable stages:

**Stage 1**: Framework Upgrade (Next.js 16 + React 19)
**Stage 2**: Authentication Migration (Auth.js v5)
**Stage 3**: Tailwind CSS v4 Migration
**Stage 4**: Component Library Setup (shadcn/ui)
**Stage 5**: Component Migration (Headless UI → shadcn)
**Stage 6**: Chart Migration (Tremor → shadcn/Recharts)
**Stage 7**: Testing & Refinement

**Alternative: Big Bang Approach** (Higher Risk)
- Do everything at once
- Faster but riskier
- Harder to debug issues
- Not recommended given scope

**RECOMMENDATION**: Proceed with **Staged Migration** approach

## Phase 4: Stage 1 - Framework Upgrade

### 4.1 Update Core Packages

```bash
cd client

# Update Next.js and React
pnpm update next@latest react@latest react-dom@latest

# Update TypeScript types
pnpm update @types/react@latest @types/react-dom@latest

# Update related tooling
pnpm update eslint-config-next@latest
pnpm update @types/node@latest
```

### 4.2 Run Next.js Codemod

```bash
npx @next/codemod@canary upgrade latest
```

This automatically migrates:
- Async Request APIs
- Dynamic imports
- Other Next.js 16 patterns

### 4.3 Manual Code Updates

**Update params usage**:
```typescript
// BEFORE (Next.js 15)
export default function Page({ params }) {
  const { id } = params;
}

// AFTER (Next.js 16)
export default async function Page({ params }) {
  const { id } = await params;
}
```

**Update cookies/headers** (if used):
```typescript
// BEFORE
import { cookies } from 'next/headers';
const cookieStore = cookies();

// AFTER
import { cookies } from 'next/headers';
const cookieStore = await cookies();
```

**Simplify forwardRef** (if any):
```typescript
// BEFORE (React 18)
const Component = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>
});

// AFTER (React 19)
function Component({ ref, children }) {
  return <div ref={ref}>{children}</div>
}
```

### 4.4 Testing

- [ ] Application builds without errors
- [ ] Dev server starts successfully
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Hot reload works

**Commit Point**: "feat: upgrade to Next.js 16 and React 19"

## Phase 5: Stage 2 - Authentication Migration

### 5.1 Research Auth.js v5

- [ ] Review migration guide: https://authjs.dev/getting-started/migrating-to-v5
- [ ] Understand new configuration structure
- [ ] Review session handling changes
- [ ] Document environment variable changes

### 5.2 Update Dependencies

```bash
# Remove old next-auth
pnpm remove next-auth

# Install Auth.js v5
pnpm add next-auth@beta
# Or specific version if stable: pnpm add next-auth@^5.0.0
```

### 5.3 Migrate Configuration

**Update `/api/auth/[...nextauth].ts`**:
```typescript
// BEFORE (next-auth v4)
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export default NextAuth({
  providers: [EmailProvider({...})],
  // v4 config
});

// AFTER (Auth.js v5)
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [EmailProvider({...})],
  // v5 config
});
```

**Update `_app.tsx`**:
```typescript
// BEFORE
import { SessionProvider } from 'next-auth/react';

// AFTER (check v5 docs for actual changes)
import { SessionProvider } from 'next-auth/react';
```

### 5.4 Update Session Usage

- [ ] Update all `useSession()` hooks
- [ ] Update server-side session checks
- [ ] Verify email header authentication still works
- [ ] Update middleware if used

### 5.5 Testing

- [ ] Login flow works
- [ ] Logout works
- [ ] Session persists correctly
- [ ] Protected routes work
- [ ] Email header sent to backend

**Commit Point**: "feat: migrate to Auth.js v5"

## Phase 6: Stage 3 - Tailwind CSS v4 Migration

### 6.1 Run Tailwind Upgrade Tool

```bash
cd client
npx @tailwindcss/upgrade@next
```

This automates:
- Config file migration
- Import statement updates
- Utility class updates

### 6.2 Manual Configuration Migration

**Update `src/styles/globals.css`**:
```css
/* BEFORE (Tailwind v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* AFTER (Tailwind v4) */
@import "tailwindcss";
```

**Migrate `tailwind.config.js` to CSS**:
```css
/* In globals.css or theme.css */
@import "tailwindcss";

@theme {
  --color-primary: #your-color;
  /* Other theme variables */
}
```

### 6.3 Update Dependencies

```bash
# Remove old Tailwind
pnpm remove tailwindcss autoprefixer postcss

# Install Tailwind v4 packages
pnpm add tailwindcss@latest
pnpm add @tailwindcss/postcss@latest
pnpm add @tailwindcss/cli@latest

# Update Tailwind plugins
pnpm update @tailwindcss/forms@latest
pnpm update @tailwindcss/typography@latest
pnpm update @tailwindcss/aspect-ratio@latest

# Update utilities
pnpm update tailwind-merge@latest
```

### 6.4 Update PostCSS Config

**Update `postcss.config.js`**:
```javascript
// BEFORE (Tailwind v3)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// AFTER (Tailwind v4)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 6.5 Handle Breaking Changes

- [ ] Update deprecated utilities
- [ ] Fix arbitrary value syntax if needed
- [ ] Update custom @apply directives
- [ ] Verify responsive breakpoints
- [ ] Check dark mode classes

### 6.6 Visual Testing

- [ ] Compare screenshots with before state
- [ ] Check all pages for styling issues
- [ ] Verify responsive design
- [ ] Test dark mode (if used)
- [ ] Check hover states
- [ ] Verify focus states

**Commit Point**: "feat: upgrade to Tailwind CSS v4"

## Phase 7: Stage 4 - shadcn/ui Setup

### 7.1 Install shadcn/ui

```bash
cd client
npx shadcn@latest init
```

**Configuration Prompts**:
- Style: Default (or choose preferred)
- Base color: Choose to match current theme
- CSS variables: Yes (recommended)
- React Server Components: No (using Pages Router)
- Where to place components: `src/components/ui`
- Tailwind config: Yes
- Path aliases: `@/*` (already configured)

### 7.2 Install Base Components

Install components we'll need for migration:

```bash
# Dialog components (for modals)
npx shadcn@latest add dialog

# Form components
npx shadcn@latest add select
npx shadcn@latest add switch

# Navigation
npx shadcn@latest add dropdown-menu
npx shadcn@latest add accordion

# Display components
npx shadcn@latest add badge
npx shadcn@latest add table

# Date picker
npx shadcn@latest add calendar
npx shadcn@latest add popover

# Charts (with Recharts)
npx shadcn@latest add chart

# Tabs
npx shadcn@latest add tabs

# Other utilities
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add input
```

### 7.3 Verify Installation

- [ ] Components created in `src/components/ui/`
- [ ] Dependencies installed (@radix-ui packages, recharts)
- [ ] Utils file created (`src/lib/utils.ts` or similar)
- [ ] No build errors

**Commit Point**: "feat: install shadcn/ui component library"

## Phase 8: Stage 5 - Component Migration (Headless UI → shadcn)

### 8.1 Migration Priority Order

1. **Dialog (8 usages)** - Most common, high impact
2. **Listbox → Select (1 usage)** - Form component
3. **Switch (1 usage)** - Form component
4. **Menu → Dropdown Menu (1 usage)** - Navigation
5. **Disclosure → Accordion (1 usage)** - Navigation

### 8.2 Dialog Migration

**Files to update**:
- `src/components/Modal/Modal.tsx`
- `src/components/Modal/ModalHeader.tsx`
- `src/components/ConfirmDeleteModal.tsx`
- `src/components/ImportModal.tsx`
- `src/pages/products/_components/sales/SaleModal.tsx`
- `src/pages/products/_components/expenses/ExpenseModal.tsx`
- `src/pages/products/_components/_ColumnsModal.tsx`
- `src/pages/products/_components/logs/LogProductModal.tsx`
- `src/pages/animals/_components/AddNewModal.tsx`

**Migration Pattern**:
```tsx
// BEFORE (Headless UI)
import { Dialog, Transition } from '@headlessui/react';

<Transition show={isOpen}>
  <Dialog onClose={onClose}>
    <Transition.Child>
      <Dialog.Overlay />
    </Transition.Child>
    <Transition.Child>
      <Dialog.Title>Title</Dialog.Title>
      {/* content */}
    </Transition.Child>
  </Dialog>
</Transition>

// AFTER (shadcn/ui)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

**Steps**:
- [ ] Migrate base Modal component first
- [ ] Update ModalHeader to use DialogHeader
- [ ] Migrate ConfirmDeleteModal
- [ ] Migrate ImportModal
- [ ] Migrate product-related modals
- [ ] Migrate animal modals
- [ ] Test each modal after migration
- [ ] Remove Transition components
- [ ] Update prop interfaces

### 8.3 Select Migration (FormSelect.tsx)

```tsx
// BEFORE (Headless UI)
import { Listbox, Transition } from '@headlessui/react';

<Listbox value={selected} onChange={setSelected}>
  <Listbox.Button>{selected.name}</Listbox.Button>
  <Transition>
    <Listbox.Options>
      {options.map((option) => (
        <Listbox.Option value={option}>
          {option.name}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  </Transition>
</Listbox>

// AFTER (shadcn/ui)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    {options.map((option) => (
      <SelectItem value={option.id} key={option.id}>
        {option.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Steps**:
- [ ] Update FormSelect component
- [ ] Update prop interfaces
- [ ] Test all select usages
- [ ] Verify keyboard navigation
- [ ] Check mobile behavior

### 8.4 Switch Migration (Toggle.tsx)

```tsx
// BEFORE (Headless UI)
import { Switch } from '@headlessui/react';

<Switch
  checked={enabled}
  onChange={setEnabled}
  className={classNames(...)}
>
  <span>Label</span>
</Switch>

// AFTER (shadcn/ui)
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Switch
    id="switch"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="switch">Label</Label>
</div>
```

**Steps**:
- [ ] Update Toggle component
- [ ] Update prop names (onChange → onCheckedChange)
- [ ] Add Label component
- [ ] Test all toggle usages
- [ ] Verify accessibility

### 8.5 Dropdown Menu Migration (_layout.tsx)

```tsx
// BEFORE (Headless UI)
import { Menu, Transition } from '@headlessui/react';

<Menu>
  <Menu.Button>Options</Menu.Button>
  <Transition>
    <Menu.Items>
      <Menu.Item>
        {({ active }) => (
          <button className={active ? 'bg-blue-500' : ''}>
            Item 1
          </button>
        )}
      </Menu.Item>
    </Menu.Items>
  </Transition>
</Menu>

// AFTER (shadcn/ui)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger>Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Steps**:
- [ ] Update navigation menu
- [ ] Remove render prop pattern
- [ ] Test menu interactions
- [ ] Verify keyboard navigation

### 8.6 Disclosure/Accordion Migration (_layout.tsx)

```tsx
// BEFORE (Headless UI)
import { Disclosure } from '@headlessui/react';

<Disclosure>
  <Disclosure.Button>Open</Disclosure.Button>
  <Disclosure.Panel>Content</Disclosure.Panel>
</Disclosure>

// AFTER (shadcn/ui)
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Open</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Steps**:
- [ ] Update disclosure usage
- [ ] Test expand/collapse
- [ ] Verify animations

### 8.7 Remove Headless UI

After all components migrated:
```bash
pnpm remove @headlessui/react @headlessui/tailwindcss
```

**Commit Point**: "feat: migrate from Headless UI to shadcn/ui"

## Phase 9: Stage 6 - Chart Migration (Tremor → shadcn/Recharts)

### 9.1 Badge Migration (Simple)

**File**: `src/pages/animals/index.tsx`

```tsx
// BEFORE (Tremor)
import { Badge } from '@tremor/react';

<Badge color="blue">Active</Badge>

// AFTER (shadcn/ui)
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Active</Badge>
```

**Steps**:
- [ ] Update badge import
- [ ] Map Tremor colors to shadcn variants
- [ ] Test badge rendering

### 9.2 Tabs Migration

**Files**: Chart components

```tsx
// BEFORE (Tremor)
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';

<TabGroup>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</TabGroup>

// AFTER (shadcn/ui)
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### 9.3 Chart Migration

**Files**:
- `src/pages/products/_components/_Chart.tsx`
- `src/pages/products/_components/_ProgressiveChart.tsx`
- `src/pages/products/_components/_ProfitLossChart.tsx`

**AreaChart Migration**:
```tsx
// BEFORE (Tremor)
import { AreaChart } from '@tremor/react';

<AreaChart
  data={data}
  index="date"
  categories={["value"]}
  colors={["blue"]}
/>

// AFTER (shadcn/ui with Recharts)
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

<ChartContainer config={chartConfig}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <ChartTooltip />
    <Area
      type="monotone"
      dataKey="value"
      stroke="var(--color-value)"
      fill="var(--color-value)"
    />
  </AreaChart>
</ChartContainer>
```

**BarChart Migration** (similar pattern):
```tsx
// Use Bar component instead of Area
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <ChartTooltip />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>
```

**Steps**:
- [ ] Install Recharts if not included: `pnpm add recharts`
- [ ] Migrate AreaChart components
- [ ] Migrate BarChart components
- [ ] Update chart styling to match current design
- [ ] Test chart interactions (tooltips, hover)
- [ ] Verify responsive behavior
- [ ] Test with real data

### 9.4 Table Migration (SortableTable.tsx)

**Most Complex Migration**:
```tsx
// BEFORE (Tremor)
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';

<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Column</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>

// AFTER (shadcn/ui)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Additional Requirements**:
- Maintain sorting functionality
- Maintain filtering if present
- Preserve pagination if present
- Keep current styling

**Steps**:
- [ ] Migrate SortableTable component structure
- [ ] Implement sorting with shadcn Table
- [ ] Test sorting behavior
- [ ] Verify all table usages
- [ ] Check responsive behavior

### 9.5 Remove Tremor

After all components migrated:
```bash
pnpm remove @tremor/react
```

**Commit Point**: "feat: migrate from Tremor to shadcn/ui charts and tables"

## Phase 10: Stage 7 - Date Picker Migration

### 10.1 Migrate react-day-picker

**Find current usage**:
```bash
grep -r "react-day-picker" src/ -A 5 -B 5
```

**Migration Pattern**:
```tsx
// BEFORE (react-day-picker)
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

<DayPicker
  mode="single"
  selected={date}
  onSelect={setDate}
/>

// AFTER (shadcn/ui)
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      {date ? format(date, 'PPP') : 'Pick a date'}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

**Steps**:
- [ ] Find all date picker usages
- [ ] Migrate to shadcn Calendar
- [ ] Test date selection
- [ ] Verify date formatting
- [ ] Check form integration

### 10.2 Remove react-day-picker

```bash
pnpm remove react-day-picker
```

**Commit Point**: "feat: migrate to shadcn date picker"

## Phase 11: Testing & Validation

### 11.1 Development Testing

```bash
cd client
pnpm run dev
```

**Checklist**:
- [ ] Application starts without errors
- [ ] No console warnings
- [ ] Hot reload works
- [ ] All pages load

### 11.2 Build Testing

```bash
pnpm run build
pnpm run start
```

**Checklist**:
- [ ] Build completes successfully
- [ ] No build errors or warnings
- [ ] Production mode runs correctly
- [ ] Check bundle size (should be similar or smaller)

### 11.3 Component Testing

**Modals (8 components)**:
- [ ] All modals open/close correctly
- [ ] Modal animations work
- [ ] Backdrop clicks work
- [ ] Escape key closes modals
- [ ] Focus management correct
- [ ] Mobile behavior correct

**Forms**:
- [ ] All selects work
- [ ] Switches toggle correctly
- [ ] Date pickers function
- [ ] Form validation works
- [ ] Submit actions work

**Navigation**:
- [ ] Dropdown menus work
- [ ] Accordions expand/collapse
- [ ] Mobile navigation works

**Data Display**:
- [ ] Tables render correctly
- [ ] Table sorting works
- [ ] Charts display data
- [ ] Chart interactions work
- [ ] Badges display correctly
- [ ] Tabs switch correctly

### 11.4 Feature Testing

**Authentication**:
- [ ] Login works
- [ ] Logout works
- [ ] Session persists
- [ ] Protected routes work
- [ ] Email header sent correctly

**CRUD Operations**:
- [ ] Animals CRUD
- [ ] Products CRUD
- [ ] Sales CRUD
- [ ] Expenses CRUD

**Data Operations**:
- [ ] Import works
- [ ] Export works
- [ ] Data validation works

### 11.5 Visual Regression Testing

- [ ] Compare screenshots with originals
- [ ] Check all responsive breakpoints
- [ ] Verify colors match
- [ ] Check spacing/padding
- [ ] Verify font sizes
- [ ] Check hover states
- [ ] Check focus states
- [ ] Verify loading states
- [ ] Check error states

### 11.6 Cross-Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari 16.4+ (required for Tailwind v4)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### 11.7 Performance Testing

- [ ] Page load times (should be same or better)
- [ ] Bundle size comparison
- [ ] Lighthouse scores
- [ ] Time to Interactive
- [ ] First Contentful Paint

## Phase 12: Server Integration Testing

### 12.1 Backend Compatibility

- [ ] All API calls work
- [ ] Email header authentication works
- [ ] CORS still configured correctly
- [ ] Error handling works
- [ ] Response parsing works

### 12.2 End-to-End Testing

- [ ] Complete user workflows
- [ ] Multi-step operations
- [ ] Data persistence
- [ ] Real-time updates (if any)

## Phase 13: Documentation & Cleanup

### 13.1 Update Documentation

- [ ] Update CLAUDE.md with new stack:
  ```markdown
  - Next.js: 16.0.1
  - React: 19.2.0
  - Tailwind CSS: 4.1.16
  - Component Library: shadcn/ui
  - Charts: Recharts
  - Authentication: Auth.js v5
  ```

- [ ] Update README.md if needed
- [ ] Document shadcn/ui usage patterns
- [ ] Document new component locations

### 13.2 Code Cleanup

- [ ] Remove unused imports
- [ ] Remove commented code
- [ ] Update comments
- [ ] Fix linting issues
- [ ] Run prettier

### 13.3 Dependency Cleanup

**Verify removed**:
```bash
# Should NOT be in package.json
grep -E "headlessui|tremor|react-day-picker" package.json
```

**Update deprecated packages**:
```bash
pnpm outdated
pnpm update
```

### 13.4 Final Checks

```bash
# Lint everything
pnpm run eslint

# Format everything
pnpm run prettier

# Build check
pnpm run build
```

## Phase 14: Deployment

### 14.1 Pre-Deployment

- [ ] All tests passing
- [ ] All features working
- [ ] No console errors
- [ ] Documentation updated
- [ ] Team review complete

### 14.2 Staging Deployment

- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Full feature testing
- [ ] Performance testing
- [ ] Get stakeholder approval

### 14.3 Production Deployment

- [ ] Create release PR
- [ ] Merge to main
- [ ] Deploy to production
- [ ] Monitor error tracking
- [ ] Monitor performance
- [ ] Monitor user feedback

### 14.4 Rollback Plan

**If issues arise**:
1. Keep old branch: `git branch backup/pre-modernization main~1`
2. Revert commit: `git revert <commit-hash>`
3. Redeploy previous version
4. Document issues
5. Plan fixes

## Phase 15: Post-Deployment

### 15.1 Monitoring (First 48 Hours)

- [ ] Error tracking (Sentry/similar)
- [ ] Performance metrics
- [ ] User feedback
- [ ] API error rates
- [ ] Page load times

### 15.2 Optimization Opportunities

**Enable React Compiler**:
```javascript
// next.config.js
module.exports = {
  reactCompiler: true,
};
```

**Leverage New React 19 Features**:
- [ ] Use `useActionState` for forms
- [ ] Use `useFormStatus` for pending states
- [ ] Explore View Transitions
- [ ] Consider Activity component for background work

**Tailwind CSS v4 Features**:
- [ ] Use new CSS features
- [ ] Optimize theme configuration
- [ ] Explore new utilities

### 15.3 Team Training

- [ ] Document shadcn/ui patterns
- [ ] Share Tailwind v4 changes
- [ ] Explain Auth.js v5 differences
- [ ] Create component examples
- [ ] Update onboarding docs

## Risk Assessment

### Critical Risks 🔴

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auth migration breaks login | CRITICAL | Thorough testing, staged rollout, rollback plan |
| Tailwind v4 styling breaks | HIGH | Visual regression testing, screenshot comparison |
| Chart migration data issues | HIGH | Test with real data, validate calculations |
| Component migration regressions | HIGH | Comprehensive testing checklist |
| Build failures | CRITICAL | Test builds frequently, CI/CD validation |

### High Risks 🟡

| Risk | Impact | Mitigation |
|------|--------|------------|
| Table sorting breaks | MEDIUM | Test all table features thoroughly |
| Modal UX changes | MEDIUM | User acceptance testing |
| Performance degradation | MEDIUM | Performance testing, monitoring |
| Type errors | MEDIUM | TypeScript strict mode, incremental fixing |
| Mobile responsiveness | MEDIUM | Mobile testing on real devices |

### Medium Risks 🟢

| Risk | Impact | Mitigation |
|------|--------|------------|
| Minor styling inconsistencies | LOW | Visual review, quick CSS fixes |
| Animation differences | LOW | Match animations to originals |
| Browser compatibility | LOW | Test on required browsers |

## Estimated Effort

### Time Breakdown

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Research & Discovery | 6 |
| 2 | Pre-Migration Prep | 4 |
| 3 | Framework Upgrade | 6 |
| 4 | Auth Migration | 8 |
| 5 | Tailwind v4 Migration | 10 |
| 6 | shadcn Setup | 3 |
| 7 | Headless UI Migration | 12 |
| 8 | Tremor Migration | 10 |
| 9 | Date Picker Migration | 2 |
| 10 | Testing & Validation | 16 |
| 11 | Server Integration | 3 |
| 12 | Documentation | 4 |
| 13 | Deployment | 4 |
| 14 | Buffer for Issues | 12 |

**Total Estimated Time**: **100 hours** (~2.5 weeks for single developer, ~1.5 weeks for pair)

### Complexity Factors

**High Complexity** (more time needed):
- Large codebase
- Many component instances
- Complex charts
- Custom styling

**Medium Complexity** (as estimated):
- Moderate codebase
- Standard components
- Simple charts

**Low Complexity** (less time needed):
- Small codebase
- Few component instances
- No charts
- Simple styling

## Success Criteria

### Must Have ✅
- [ ] Application builds without errors
- [ ] All features work identically
- [ ] No console errors
- [ ] Authentication works perfectly
- [ ] All forms functional
- [ ] All CRUD operations work
- [ ] Charts display correctly
- [ ] Tables sort correctly
- [ ] Mobile responsive

### Should Have ✅
- [ ] Performance same or better
- [ ] Bundle size same or smaller
- [ ] Visual parity with current UI
- [ ] Smooth animations
- [ ] Accessible components

### Nice to Have ✅
- [ ] Improved performance
- [ ] Smaller bundle size
- [ ] Enhanced animations
- [ ] Better accessibility
- [ ] Cleaner code

## References

### Framework Documentation
- Next.js 16: https://nextjs.org/blog/next-16
- Next.js 16 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- React 19: https://react.dev/blog/2024/12/05/react-19
- React 19.2: https://react.dev/blog/2025/10/01/react-19-2

### Authentication
- Auth.js: https://authjs.dev
- Auth.js v5 Migration: https://authjs.dev/getting-started/migrating-to-v5
- next-auth Next.js 16 Issue: https://github.com/nextauthjs/next-auth/issues/13302

### Styling
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Tailwind v4 Config: https://tailwindcss.com/docs/configuration

### Components
- shadcn/ui: https://ui.shadcn.com
- shadcn/ui Installation: https://ui.shadcn.com/docs/installation/next
- shadcn/ui React 19: https://ui.shadcn.com/docs/react-19
- Recharts: https://recharts.org

### Migration Guides
- Headless UI Changelog: https://github.com/tailwindlabs/headlessui/blob/main/packages/@headlessui-react/CHANGELOG.md
- Tremor to shadcn: (Community guides available)

## Notes

### Key Decisions

1. **Staged Migration**: Chosen over big bang for lower risk
2. **shadcn/ui**: Chosen for better React 19 support and modern patterns
3. **Tailwind v4**: Included to modernize entire stack at once
4. **Auth.js v5**: Required for Next.js 16 support

### Lessons Learned (To Be Updated)

- Document lessons learned during migration
- Share with team
- Update this section post-migration

### Future Improvements

After this migration, consider:
- [ ] Add unit tests
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Implement Storybook for components
- [ ] Add performance monitoring
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Optimize images
- [ ] Add PWA features

---

**Created by**: Claude Code
**Last Updated**: October 30, 2025
**Status**: Planning Phase
**Assigned to**: TBD
**Target Completion**: TBD
