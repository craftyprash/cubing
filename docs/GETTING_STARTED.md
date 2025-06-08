# Getting Started with CraftyCubing

This guide will help you set up CraftyCubing for development and understand the project structure.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/craftycubing.git
cd craftycubing
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open in Browser**
Navigate to `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
craftycubing/
├── docs/                    # Documentation
│   ├── README.md           # Documentation index
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DATABASE.md         # Database schema
│   ├── TIMER_SYSTEM.md     # Timer implementation
│   └── USER_MANUAL.md      # User guide
├── public/                 # Static assets
│   ├── cube-icon.svg       # App favicon
│   ├── brand-logo.png      # Brand logo
│   └── timer-cube-logo.svg # Header logo
├── src/
│   ├── components/         # React components
│   │   ├── cube/          # Case practice components
│   │   ├── timer/         # Timer components
│   │   └── shared/        # Shared UI components
│   ├── constants/         # Algorithm definitions
│   │   ├── f2lcases.ts    # F2L cases and algorithms
│   │   ├── ollcases.ts    # OLL cases and algorithms
│   │   └── pllcases.ts    # PLL cases and algorithms
│   ├── db/                # Database layer
│   │   └── index.ts       # Dexie configuration
│   ├── pages/             # Main page components
│   │   ├── Training.tsx   # Full solve practice
│   │   └── CaseLibrary.tsx # Algorithm practice
│   ├── types/             # TypeScript definitions
│   │   └── index.ts       # Core type definitions
│   ├── utils/             # Utility functions
│   │   ├── scrambleUtils.ts # Scramble generation
│   │   ├── timeUtils.ts    # Time formatting/stats
│   │   └── visualCube.ts   # Cube visualization
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Development Server
- **Hot Reload**: Changes automatically reflected in browser
- **TypeScript**: Real-time type checking
- **Fast Refresh**: React state preserved during updates

### Building for Production
```bash
npm run build
```
- Optimized bundle with tree shaking
- Minified CSS and JavaScript
- Static assets optimized
- Output in `dist/` directory

## 🧩 Key Technologies

### Frontend Framework
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool with HMR

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization
- **Responsive Design**: Mobile-first approach

### Database
- **IndexedDB**: Browser-native database
- **Dexie.js**: Promise-based IndexedDB wrapper
- **Live Queries**: Real-time UI updates

### Icons and Assets
- **Lucide React**: Consistent icon library
- **SVG Icons**: Scalable vector graphics
- **Optimized Images**: Compressed assets

## 🔧 Configuration

### Environment Setup
No environment variables required - the app runs entirely client-side.

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx"
  }
}
```

### Tailwind Configuration
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette for speedcubing
      }
    }
  }
}
```

## 📱 Development Tips

### Browser DevTools
- **React DevTools**: Install for component debugging
- **IndexedDB Inspector**: View database contents
- **Performance Tab**: Monitor timer precision

### Mobile Development
- **Chrome DevTools**: Use device simulation
- **Touch Events**: Test on actual mobile devices
- **Responsive Design**: Test various screen sizes

### Timer Development
- **Precision Testing**: Verify timing accuracy
- **Event Handling**: Test keyboard and touch inputs
- **State Management**: Monitor timer state transitions

## 🧪 Testing Strategy

### Manual Testing
- **Timer Accuracy**: Verify centisecond precision
- **Cross-Browser**: Test in multiple browsers
- **Mobile Devices**: Test touch interactions
- **Data Persistence**: Verify database operations

### Performance Testing
- **Timer Responsiveness**: Ensure smooth operation
- **Large Datasets**: Test with many solves
- **Memory Usage**: Monitor for memory leaks

### Accessibility Testing
- **Keyboard Navigation**: Test all keyboard shortcuts
- **Screen Readers**: Verify ARIA labels
- **Color Contrast**: Ensure readable text

## 🔍 Debugging

### Common Issues

#### Timer Not Responding
```javascript
// Check event listeners
console.log('Timer state:', timerState);
console.log('Event listeners attached:', !!window.onkeydown);
```

#### Database Issues
```javascript
// Debug database operations
import { db } from './src/db';
console.log('Database version:', db.verno);
console.log('Tables:', db.tables.map(t => t.name));
```

#### Performance Issues
```javascript
// Monitor render performance
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Render:', id, phase, actualDuration);
}
```

### Development Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management (if added)
- **Lighthouse**: Performance auditing
- **Browser Console**: Error tracking

## 📚 Learning Resources

### React and TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Speedcubing
- [WCA Regulations](https://www.worldcubeassociation.org/regulations/)
- [CFOP Method Guide](https://www.speedsolving.com/wiki/index.php/CFOP_method)
- [Algorithm Database](https://www.speedsolving.com/wiki/index.php/List_of_algorithms)

### Web Development
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Dexie.js Guide](https://dexie.org/)

## 🤝 Contributing

### Code Style
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent formatting
- **TypeScript**: Maintain strict type checking
- **Comments**: Document complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Pull Request Guidelines
- **Clear Description**: Explain what and why
- **Screenshots**: Include UI changes
- **Testing**: Verify functionality works
- **Documentation**: Update docs if needed

## 🚀 Deployment

### Static Hosting
CraftyCubing can be deployed to any static hosting service:

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use GitHub Actions
- **Firebase Hosting**: Use Firebase CLI

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Optimize for production
npm run build -- --mode production
```

---

This guide provides everything you need to start developing with CraftyCubing. For specific implementation details, refer to the other documentation files in the `docs/` directory.