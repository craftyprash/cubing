# Keyboard Shortcuts Reference

CraftyCubing provides comprehensive keyboard support for efficient speedcubing practice. This guide covers all keyboard shortcuts and controls.

## ⌨️ Global Shortcuts

### Timer Controls
| Key | Action | Context |
|-----|--------|---------|
| `Space` | Hold to start timer | When timer is idle |
| `Space` | Stop timer | When timer is running |
| `Escape` | Cancel timer | When timer is running |
| `Escape` | Return to idle | When timer is ready/inspection |

### Navigation
| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Navigate between elements | Global |
| `Shift + Tab` | Navigate backwards | Global |
| `Enter` | Confirm action | Forms and dialogs |
| `Escape` | Cancel action | Forms and dialogs |

## ⏱️ Timer-Specific Shortcuts

### Main Timer (Training Page)

#### Starting the Timer
```
Without Inspection:
1. Hold Space for 0.25 seconds
2. Release to start timer
3. Timer background turns red → green

With Inspection:
1. Tap Space to start inspection (15s countdown)
2. Hold Space for 0.25 seconds during inspection
3. Release to start timer
4. Timer background: gray → yellow → red → green
```

#### Stopping the Timer
```
Normal Stop:
- Tap Space while timer is running
- Timer shows final time

Emergency Cancel:
- Press Escape while timer is running
- Timer cancels without recording solve
- Returns to idle state
```

#### Timer States and Controls
| State | Background | Space Action | Escape Action |
|-------|------------|--------------|---------------|
| Idle | Gray | Start inspection or ready | No action |
| Inspection | Yellow | Hold to ready | Cancel to idle |
| Ready | Red | Release to start | Cancel to idle |
| Running | Green | Stop timer | Cancel timer |
| Stopped | Blue | Start next solve | No action |

### Case Timer (Case Library)

#### Simplified Controls
| Key | Action | State |
|-----|--------|-------|
| `Space` | Hold to start | Idle/Stopped |
| `Space` | Stop timer | Running |
| `Escape` | Cancel timer | Running |
| `Escape` | Close overlay | Any state |

## 📝 Form and Input Shortcuts

### Session Management
| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Create session | When typing session name |
| `Escape` | Cancel creation | When typing session name |

### Scramble Editing
| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Save scramble | When editing scramble |
| `Escape` | Cancel edit | When editing scramble |

### Solve Details Modal
| Key | Action | Context |
|-----|--------|---------|
| `Escape` | Close modal | When modal is open |
| `Enter` | Save notes | When editing notes |

### Algorithm Editing
| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Save changes | When editing algorithms |
| `Escape` | Cancel edit | When editing algorithms |
| `Tab` | Next algorithm field | When editing |
| `Shift + Tab` | Previous algorithm field | When editing |

## 🎯 Context-Specific Shortcuts

### Training Page
```typescript
// Keyboard event handling
const handleKeyDown = (e: KeyboardEvent) => {
  // Prevent spacebar when editing
  if (editingScramble || isTextInput) {
    return; // Allow normal typing
  }
  
  if (e.code === "Space") {
    e.preventDefault();
    handleTimerAction();
  }
};
```

#### Smart Context Detection
CraftyCubing automatically detects when you're typing and disables timer shortcuts:

```typescript
// Context detection
const isTextInput = activeElement?.tagName === 'INPUT' || 
                   activeElement?.tagName === 'TEXTAREA' ||
                   activeElement?.isContentEditable;

// Container-based detection
const hasActiveInput = container.hasAttribute('data-input-active');
```

### Case Library Page
| Key | Action | Context |
|-----|--------|---------|
| `Space` | Timer control | When case timer is active |
| `Escape` | Close timer overlay | When timer overlay is open |
| `Enter` | Save algorithm | When editing case algorithms |

## 🔧 Advanced Keyboard Features

### Event Capture Strategy
CraftyCubing uses event capture to ensure reliable keyboard handling:

```typescript
// Capture phase event listeners
window.addEventListener("keydown", handleKeyDown, true);
window.addEventListener("keyup", handleKeyUp, true);

// Cleanup
return () => {
  window.removeEventListener("keydown", handleKeyDown, true);
  window.removeEventListener("keyup", handleKeyUp, true);
};
```

### Input Prevention
Prevents timer activation during text input:

```typescript
// Global keydown handler
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Space") {
    const activeElement = document.activeElement;
    const isTextInput = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA';
    
    if (!isTextInput && !editingMode) {
      e.preventDefault();
      e.stopPropagation();
      // Handle timer action
    }
  }
};
```

### Modal and Overlay Handling
```typescript
// Modal keyboard handling
const handleModalKeyDown = (e: React.KeyboardEvent) => {
  e.stopPropagation(); // Prevent global handlers
  
  if (e.key === 'Escape') {
    closeModal();
  }
};
```

## 🎮 Accessibility Features

### Screen Reader Support
| Element | ARIA Label | Keyboard Action |
|---------|------------|-----------------|
| Timer | "Timer: {state}" | Space to control |
| Session Dropdown | "Current session" | Arrow keys to navigate |
| Algorithm Buttons | "Algorithm: {name}" | Enter to select |

### Focus Management
```typescript
// Focus restoration after modal close
const handleCloseModal = () => {
  closeModal();
  
  // Return focus to trigger element
  setTimeout(() => {
    triggerElement.focus();
  }, 100);
};
```

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through interface
- **Focus Indicators**: Clear visual focus indicators
- **Skip Links**: Skip to main content (future enhancement)

## 📱 Mobile Keyboard Considerations

### Virtual Keyboard Handling
```typescript
// Detect virtual keyboard
const handleResize = () => {
  const isVirtualKeyboard = window.innerHeight < initialHeight * 0.75;
  
  if (isVirtualKeyboard) {
    // Adjust layout for virtual keyboard
    adjustLayoutForKeyboard();
  }
};
```

### Touch vs Keyboard
- **Hybrid Input**: Supports both touch and keyboard simultaneously
- **Context Switching**: Seamless switching between input methods
- **Preference Detection**: Detects primary input method

## 🔍 Troubleshooting Keyboard Issues

### Common Problems

#### Spacebar Not Working
**Symptoms**: Timer doesn't respond to spacebar
**Solutions**:
1. Check if you're typing in a text field
2. Ensure you're holding for full 0.25 seconds
3. Verify browser focus is on the page
4. Clear browser cache and reload

#### Keyboard Shortcuts Conflicting
**Symptoms**: Browser shortcuts interfere with app
**Solutions**:
1. Use fullscreen mode (F11)
2. Disable browser extensions
3. Check browser keyboard settings
4. Use incognito/private mode

#### Input Fields Not Working
**Symptoms**: Can't type in text fields
**Solutions**:
1. Click directly in the text field
2. Check if modal is properly focused
3. Verify JavaScript is enabled
4. Try different browser

### Browser-Specific Issues

#### Chrome
- **Extension Conflicts**: Disable extensions that capture keyboard
- **Hardware Acceleration**: Enable for better performance
- **Site Permissions**: Ensure site has necessary permissions

#### Firefox
- **Accessibility Settings**: Check accessibility preferences
- **Privacy Settings**: Verify JavaScript permissions
- **Add-on Conflicts**: Disable conflicting add-ons

#### Safari
- **Keyboard Navigation**: Enable full keyboard access in settings
- **Privacy Settings**: Allow JavaScript and local storage
- **Extension Conflicts**: Disable Safari extensions

## 🎯 Keyboard Best Practices

### Efficient Usage
1. **Learn the Patterns**: Master the hold-and-release timing
2. **Consistent Technique**: Use same finger/hand position
3. **Practice Transitions**: Smooth transitions between timer states
4. **Avoid Conflicts**: Don't use other keyboard shortcuts during timing

### Ergonomic Considerations
- **Hand Position**: Keep hands in comfortable position
- **Key Pressure**: Use light, consistent pressure
- **Break Timing**: Take breaks to avoid strain
- **Alternative Keys**: Consider remapping if needed (future feature)

### Performance Tips
```typescript
// Optimize keyboard performance
const optimizeKeyboardHandling = () => {
  // Use passive listeners where possible
  window.addEventListener('keydown', handler, { passive: false });
  
  // Debounce rapid key presses
  const debouncedHandler = debounce(handler, 10);
  
  // Minimize work in event handlers
  const lightweightHandler = (e) => {
    requestAnimationFrame(() => {
      heavyProcessing(e);
    });
  };
};
```

## 🚀 Future Keyboard Enhancements

### Planned Features
- **Custom Key Mapping**: User-configurable shortcuts
- **Macro Support**: Record and replay key sequences
- **Voice Commands**: Voice-activated shortcuts
- **Gesture Support**: Keyboard gesture recognition

### Advanced Controls
- **Multi-Key Combinations**: Complex shortcut combinations
- **Context Menus**: Keyboard-accessible context menus
- **Quick Actions**: Rapid access to common functions
- **Power User Mode**: Advanced keyboard-only interface

---

CraftyCubing's keyboard support is designed to provide efficient, accessible control over all app functions. The keyboard shortcuts follow standard conventions while providing speedcubing-specific optimizations for the best possible user experience.