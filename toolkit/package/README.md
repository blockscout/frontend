<!-- TODO @tom2drum rewrite README -->

# Your Organization's UI Toolkit

A collection of reusable Chakra UI components and theme for your organization's projects.

## Installation

```bash
npm install @your-org/toolkit
# or
yarn add @your-org/toolkit
```

## Usage

```tsx
import { Button, theme } from '@your-org/toolkit';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Button>Click me</Button>
    </ChakraProvider>
  );
}
```

## Development

1. Install dependencies:
```bash
npm install
# or
yarn
```

2. Start development server:
```bash
npm run dev
# or
yarn dev
```

3. Build the package:
```bash
npm run build
# or
yarn build
```

## Publishing

1. Update the version in `package.json`
2. Build the package:
```bash
npm run build
```
3. Publish to NPM:
```bash
npm publish
```

## Available Components

- Accordion
- Alert
- Avatar
- Badge
- Button
- Checkbox
- Close Button
- Collapsible
- Color Mode
- Dialog
- Drawer
- Field
- Heading
- Icon Button
- Image
- Input
- Input Group
- Link
- Menu
- Pin Input
- Popover
- Progress Circle
- Provider
- Radio
- Rating
- Select
- Skeleton
- Slider
- Switch
- Table
- Tabs
- Tag
- Textarea
- Toaster
- Tooltip 