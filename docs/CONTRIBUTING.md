# Contributing to CraftyCubing

Thank you for your interest in contributing to CraftyCubing! This guide will help you understand how to contribute effectively to the project.

## 🎯 Ways to Contribute

### Code Contributions
- **Bug Fixes**: Fix issues and improve stability
- **New Features**: Add functionality that enhances the user experience
- **Performance**: Optimize timer precision and app responsiveness
- **Mobile**: Improve mobile user experience
- **Accessibility**: Make the app more accessible to all users

### Non-Code Contributions
- **Documentation**: Improve guides and API documentation
- **Testing**: Report bugs and test new features
- **Design**: Suggest UI/UX improvements
- **Algorithms**: Add or improve algorithm definitions
- **Translations**: Help internationalize the app (future)

## 🚀 Getting Started

### Development Setup
1. **Fork the Repository**
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

4. **Verify Setup**
   - Open `http://localhost:5173`
   - Test timer functionality
   - Verify database operations work

### Understanding the Codebase
- **Read Documentation**: Start with `docs/ARCHITECTURE.md`
- **Explore Components**: Understand the component hierarchy
- **Test Features**: Use the app to understand user workflows
- **Review Code**: Look at existing implementations for patterns

## 📋 Contribution Guidelines

### Code Standards

#### TypeScript
- **Strict Mode**: All code must pass TypeScript strict checks
- **Type Definitions**: Provide explicit types for all functions
- **Interface Usage**: Use interfaces for object shapes
- **No `any` Types**: Avoid `any` unless absolutely necessary

```typescript
// Good
interface TimerProps {
  onComplete: (time: number) => void;
  inspectionTime: number;
  useInspection: boolean;
}

// Avoid
function handleTimer(props: any) { ... }
```

#### React Patterns
- **Functional Components**: Use function components with hooks
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Prop Drilling**: Avoid excessive prop drilling
- **Performance**: Use `useMemo` and `useCallback` appropriately

```typescript
// Good
const Timer: React.FC<TimerProps> = ({ onComplete, inspectionTime }) => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  
  const handleComplete = useCallback((time: number) => {
    onComplete(time);
  }, [onComplete]);
  
  return <div>...</div>;
};
```

#### Styling
- **Tailwind CSS**: Use Tailwind utility classes
- **Responsive Design**: Mobile-first approach
- **Consistent Spacing**: Use 8px spacing system
- **Color System**: Use defined color palette

```tsx
// Good
<div className="bg-gray-800 rounded-xl p-6 md:p-8">
  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
    Start Timer
  </button>
</div>
```

### Database Guidelines

#### Schema Changes
- **Version Increments**: Always increment database version
- **Migration Scripts**: Provide upgrade logic for schema changes
- **Data Preservation**: Never lose user data during migrations
- **Testing**: Test migrations with real data

```typescript
// Good
this.version(2).stores({
  // Keep existing tables
  solves: "++id, sessionId, date, caseId, algorithmId",
  // Add new table
  competitions: "++id, name, date, results"
});

this.version(2).upgrade(async (tx) => {
  // Migrate existing data safely
});
```

#### Query Patterns
- **Live Queries**: Use Dexie live queries for real-time updates
- **Indexing**: Ensure queries use appropriate indexes
- **Transactions**: Use transactions for related operations
- **Error Handling**: Handle database errors gracefully

### Performance Guidelines

#### Timer Precision
- **High Frequency Updates**: Use 10ms intervals for smooth display
- **Precise Timing**: Use `Date.now()` for accuracy
- **Event Handling**: Minimize event handler overhead
- **Memory Management**: Clean up intervals and listeners

#### React Performance
- **Avoid Unnecessary Renders**: Use `React.memo` when appropriate
- **Optimize Dependencies**: Minimize useEffect dependencies
- **Lazy Loading**: Use dynamic imports for large components
- **Bundle Size**: Keep bundle size reasonable

## 🐛 Bug Reports

### Before Reporting
1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce Consistently**: Ensure the bug is reproducible
3. **Test Multiple Browsers**: Verify cross-browser behavior
4. **Check Console**: Look for JavaScript errors

### Bug Report Template
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120.0
- OS: Windows 11
- Device: Desktop/Mobile

## Additional Context
Screenshots, console errors, etc.
```

## ✨ Feature Requests

### Before Requesting
1. **Check Existing Requests**: Avoid duplicate requests
2. **Consider Scope**: Ensure feature fits project goals
3. **Think About Implementation**: Consider technical feasibility
4. **User Value**: Explain how it benefits users

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, related features
```

## 🔄 Pull Request Process

### Before Creating a PR
1. **Create Issue**: Discuss the change in an issue first
2. **Fork Repository**: Work in your own fork
3. **Create Branch**: Use descriptive branch names
4. **Test Thoroughly**: Ensure everything works correctly

### Branch Naming
```bash
# Feature branches
feature/timer-improvements
feature/mobile-optimization

# Bug fix branches
fix/timer-precision-issue
fix/mobile-touch-handling

# Documentation branches
docs/api-reference-update
docs/user-guide-improvements
```

### Commit Messages
Follow conventional commit format:

```bash
# Features
feat: add inspection time settings
feat(timer): implement touch controls

# Bug fixes
fix: resolve timer precision issues
fix(mobile): improve touch event handling

# Documentation
docs: update API reference
docs(readme): add installation instructions

# Refactoring
refactor: simplify timer state management
refactor(db): optimize query performance
```

### PR Checklist
- [ ] **Code Quality**: Passes all linting and type checks
- [ ] **Testing**: Manually tested all changes
- [ ] **Documentation**: Updated relevant documentation
- [ ] **Performance**: No performance regressions
- [ ] **Mobile**: Tested on mobile devices
- [ ] **Accessibility**: Maintains accessibility standards

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Performance testing

## Screenshots
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🧪 Testing Guidelines

### Manual Testing
- **Timer Functionality**: Test all timer states and transitions
- **Database Operations**: Verify data persistence and retrieval
- **Cross-Browser**: Test in Chrome, Firefox, Safari, Edge
- **Mobile Devices**: Test on actual mobile devices
- **Performance**: Monitor for memory leaks and performance issues

### Test Cases
```typescript
// Example test scenarios
describe('Timer Component', () => {
  test('should start timer after hold duration', () => {
    // Test implementation
  });
  
  test('should handle touch events correctly', () => {
    // Test implementation
  });
  
  test('should save solve to database', () => {
    // Test implementation
  });
});
```

## 📚 Documentation Standards

### Code Documentation
- **Function Comments**: Document complex functions
- **Type Definitions**: Comment interface properties
- **Algorithm Explanations**: Explain complex algorithms
- **Usage Examples**: Provide usage examples

```typescript
/**
 * Calculates WCA-compliant averages with proper trimming
 * @param times Array of solve times in milliseconds
 * @param count Number of solves to include in average
 * @returns Average time in milliseconds, or null if insufficient data
 */
export const calculateAverage = (
  times: number[],
  count: number
): number | null => {
  // Implementation...
};
```

### Documentation Updates
- **Keep Current**: Update docs with code changes
- **User-Focused**: Write for end users, not just developers
- **Examples**: Include practical examples
- **Screenshots**: Use screenshots for UI documentation

## 🎨 Design Guidelines

### UI/UX Principles
- **Speedcubing Focus**: Design for speedcubing workflows
- **Mobile First**: Optimize for mobile usage
- **Accessibility**: Ensure usability for all users
- **Performance**: Prioritize speed and responsiveness

### Visual Design
- **Color System**: Use consistent color palette
- **Typography**: Maintain readable text hierarchy
- **Spacing**: Follow 8px spacing system
- **Icons**: Use Lucide React icons consistently

### Interaction Design
- **Touch Targets**: Minimum 44px touch targets
- **Feedback**: Provide clear visual feedback
- **Error States**: Handle errors gracefully
- **Loading States**: Show loading indicators

## 🌍 Community Guidelines

### Communication
- **Be Respectful**: Treat all contributors with respect
- **Be Constructive**: Provide helpful feedback
- **Be Patient**: Remember that everyone is learning
- **Be Inclusive**: Welcome contributors of all skill levels

### Code Reviews
- **Focus on Code**: Review the code, not the person
- **Explain Reasoning**: Explain why changes are needed
- **Suggest Improvements**: Offer specific suggestions
- **Acknowledge Good Work**: Recognize quality contributions

### Issue Discussions
- **Stay On Topic**: Keep discussions focused
- **Provide Context**: Give enough information for others to help
- **Follow Up**: Update issues with new information
- **Close When Resolved**: Close issues when they're fixed

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- **README**: Contributors section
- **Release Notes**: Major contribution acknowledgments
- **Documentation**: Author credits where appropriate

### Types of Recognition
- **Code Contributors**: Direct code contributions
- **Bug Reporters**: High-quality bug reports
- **Feature Requesters**: Valuable feature suggestions
- **Documentation**: Documentation improvements
- **Community**: Helping other contributors

## 📞 Getting Help

### Where to Ask
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For general questions
- **Code Review**: For implementation feedback

### What to Include
- **Context**: Explain what you're trying to do
- **Code**: Share relevant code snippets
- **Error Messages**: Include full error messages
- **Environment**: Specify browser, OS, device

---

Thank you for contributing to CraftyCubing! Your contributions help make speedcubing practice better for everyone. 🧩