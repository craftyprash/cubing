# Mobile Usage Guide

CraftyCubing is optimized for mobile devices, providing a seamless speedcubing experience on phones and tablets. This guide covers mobile-specific features and best practices.

## 📱 Mobile Optimizations

### Touch Controls
CraftyCubing uses advanced touch handling to provide precise timer control on mobile devices.

#### Timer Interaction
- **Hold to Start**: Touch and hold the timer area for 0.25 seconds
- **Tap to Stop**: Tap anywhere on the screen while timer is running
- **Gesture Prevention**: Prevents accidental scrolling and zooming during timing

#### Touch Feedback
- **Visual States**: Color-coded backgrounds indicate timer state
- **Haptic Feedback**: Subtle vibrations on supported devices (future feature)
- **Large Touch Targets**: Buttons sized for thumb interaction

### Responsive Design

#### Layout Adaptations
- **Compact Stats**: Condensed statistics display on small screens
- **Hidden Elements**: Non-essential UI elements hidden on mobile
- **Vertical Layout**: Single-column layout for narrow screens
- **Optimized Spacing**: Reduced padding and margins for space efficiency

#### Screen Size Handling
```css
/* Mobile-first responsive design */
.timer-display {
  font-size: 3rem;        /* Base mobile size */
}

@media (min-width: 768px) {
  .timer-display {
    font-size: 5rem;      /* Larger on tablets/desktop */
  }
}
```

## 🎮 Touch Event Handling

### Advanced Touch Processing
CraftyCubing implements sophisticated touch event handling to ensure reliable timer operation.

#### Event Prevention
```typescript
// Prevent default browser behaviors
e.preventDefault();      // Stop scrolling
e.stopPropagation();    // Stop event bubbling
style={{ touchAction: 'none' }}  // Disable touch gestures
```

#### Multi-Touch Handling
- **Single Touch**: Only responds to single finger touches
- **Touch Exclusions**: Settings buttons excluded from timer events
- **Gesture Blocking**: Prevents pinch-to-zoom and other gestures

### Touch State Management
```typescript
const handleTouchStart = useCallback((e: React.TouchEvent) => {
  const target = e.target as HTMLElement;
  const isExcludedButton = target.closest('[data-timer-exclude]');
  
  if (isExcludedButton) return; // Don't trigger timer
  
  e.preventDefault();
  e.stopPropagation();
  triggerStartAction();
}, [timerState]);
```

## 📐 Mobile Layout Features

### Compact Statistics Display
Mobile devices show a condensed statistics layout:

```typescript
// Mobile stats grid
<div className="grid grid-cols-5 gap-2 text-center">
  <div>
    <div className="text-xs text-gray-400">Single</div>
    <div className="font-mono text-sm">{formatTime(currentSingle)}</div>
  </div>
  {/* Additional stats... */}
</div>
```

### Adaptive Navigation
- **Hamburger Menu**: Collapsible navigation on small screens
- **Bottom Navigation**: Easy thumb access (future enhancement)
- **Swipe Gestures**: Navigate between sections (future enhancement)

### Mobile-Specific UI Elements

#### Solve History
Mobile solve history uses a card-based layout instead of tables:

```typescript
// Mobile card view
<div className="flex items-center justify-between p-4">
  <button className="font-mono text-xl text-left">
    {getDisplayTime(solve)}
  </button>
  <div className="flex items-center gap-3">
    <button className="p-3 rounded-lg bg-gray-700">
      <Edit className="h-5 w-5" />
    </button>
  </div>
</div>
```

#### Scramble Display
- **Text Only**: Visual cube preview hidden on mobile to save space
- **Large Text**: Increased font size for readability
- **Touch Controls**: Large buttons for scramble actions

## 🔧 Mobile Performance

### Optimization Strategies

#### Efficient Rendering
- **Conditional Rendering**: Hide non-essential elements on mobile
- **Lazy Loading**: Load components only when needed
- **Optimized Images**: Compressed assets for faster loading

#### Memory Management
```typescript
// Cleanup on mobile to prevent memory issues
useEffect(() => {
  return () => {
    if (timerInterval) clearInterval(timerInterval);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
  };
}, []);
```

#### Battery Optimization
- **Reduced Updates**: Lower update frequency when appropriate
- **Background Handling**: Pause timers when app is backgrounded
- **Efficient Animations**: Use CSS transforms for smooth animations

### Touch Performance
```typescript
// Optimized touch handling
const handleTouch = useCallback((e: TouchEvent) => {
  // Minimal processing in touch handlers
  requestAnimationFrame(() => {
    // Heavy processing in next frame
    processTouch(e);
  });
}, []);
```

## 📱 Device-Specific Features

### iOS Optimizations
- **Safari Compatibility**: Handles Safari-specific touch behaviors
- **Home Screen App**: Supports PWA installation (future)
- **Status Bar**: Respects safe areas and notches

### Android Optimizations
- **Chrome Compatibility**: Optimized for Chrome mobile
- **Hardware Back Button**: Handles Android back button
- **Keyboard Handling**: Manages virtual keyboard appearance

### Tablet Support
- **Larger Screens**: Takes advantage of tablet screen real estate
- **Landscape Mode**: Optimized layouts for landscape orientation
- **Split Screen**: Works well in split-screen mode

## 🎯 Mobile Best Practices

### Timer Usage on Mobile

#### Optimal Positioning
- **Comfortable Grip**: Hold device securely with both hands
- **Thumb Access**: Use thumbs for timer interaction
- **Stable Surface**: Place device on stable surface when possible

#### Environmental Considerations
- **Lighting**: Ensure good screen visibility
- **Distractions**: Minimize notifications during practice
- **Battery**: Keep device charged for consistent performance

### Touch Technique
```typescript
// Recommended touch pattern
1. Position thumb over timer area
2. Press and hold for 0.25 seconds
3. Watch for color change (red → green)
4. Release to start timer
5. Tap anywhere to stop
```

### Session Management on Mobile
- **Quick Access**: Use favorites for frequently practiced cases
- **Session Switching**: Easy session management with dropdown
- **Backup**: Regular data export recommended

## 🔍 Troubleshooting Mobile Issues

### Common Problems

#### Touch Not Responding
**Symptoms**: Timer doesn't start when touching
**Solutions**:
- Ensure you're holding for full 0.25 seconds
- Avoid touching settings buttons
- Clear browser cache and reload
- Try different finger/thumb

#### Scrolling Interference
**Symptoms**: Page scrolls when trying to use timer
**Solutions**:
- Touch directly on timer area
- Avoid dragging motions
- Use single finger touches only
- Update browser to latest version

#### Performance Issues
**Symptoms**: Lag or stuttering during timing
**Solutions**:
- Close other browser tabs
- Restart browser
- Clear browser cache
- Ensure sufficient device memory

### Browser-Specific Issues

#### Safari (iOS)
- **Touch Delay**: May have slight touch delay
- **Zoom Prevention**: Disable zoom in accessibility settings
- **Private Mode**: Some features may not work in private browsing

#### Chrome (Android)
- **Hardware Acceleration**: Enable in browser settings
- **Background Apps**: Close unnecessary background apps
- **Data Saver**: Disable data saver mode

## 📊 Mobile Analytics

### Performance Monitoring
CraftyCubing tracks mobile-specific metrics:

```typescript
// Mobile performance tracking
const trackMobilePerformance = () => {
  const isMobile = window.innerWidth < 768;
  const touchSupport = 'ontouchstart' in window;
  
  console.log('Mobile device:', isMobile);
  console.log('Touch support:', touchSupport);
  console.log('Screen size:', window.innerWidth, 'x', window.innerHeight);
};
```

### Usage Patterns
- **Touch Accuracy**: Monitor successful timer starts
- **Session Length**: Track mobile session duration
- **Feature Usage**: Identify most-used mobile features

## 🚀 Future Mobile Enhancements

### Planned Features
- **PWA Support**: Install as native app
- **Offline Mode**: Full offline functionality
- **Haptic Feedback**: Vibration for timer events
- **Voice Commands**: Voice-controlled timer
- **Gesture Navigation**: Swipe between sections

### Advanced Touch Features
- **3D Touch**: Pressure-sensitive controls (iOS)
- **Multi-Touch**: Advanced gesture support
- **Stylus Support**: Apple Pencil and S Pen compatibility
- **Accessibility**: Enhanced accessibility features

### Performance Improvements
- **Web Workers**: Background processing
- **Service Workers**: Caching and offline support
- **WebAssembly**: High-performance calculations
- **GPU Acceleration**: Hardware-accelerated animations

---

CraftyCubing's mobile experience is designed to provide the same precision and functionality as the desktop version while optimizing for touch interaction and mobile constraints. The app continues to evolve with mobile-first improvements and new mobile-specific features.