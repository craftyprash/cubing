# Database Upgrade Guide

This guide explains how to safely upgrade the CraftyCubing database schema without losing user data.

## Current Schema (Version 1)

```typescript
{
  solves: "++id, sessionId, date, caseId, algorithmId",
  sessions: "id, name, date, type, stage, caseId", 
  personalBests: "++id, type, date",
  userSettings: "++id",
  cubeCaseFavorites: "++id, caseId, dateAdded",
  algorithmStats: "algorithmId, caseId, lastPracticed"
}
```

## Upgrade Process

### 1. Adding New Tables

When adding a new table, increment the version number and include all existing tables:

```typescript
this.version(2).stores({
  // Keep all existing tables
  solves: "++id, sessionId, date, caseId, algorithmId",
  sessions: "id, name, date, type, stage, caseId", 
  personalBests: "++id, type, date",
  userSettings: "++id",
  cubeCaseFavorites: "++id, caseId, dateAdded",
  algorithmStats: "algorithmId, caseId, lastPracticed",
  // Add new table
  competitions: "++id, name, date, results"
});
```

### 2. Modifying Existing Tables

To add fields or change indexes:

```typescript
this.version(2).stores({
  // Modified table with new field in index
  solves: "++id, sessionId, date, caseId, algorithmId, competition",
  // ... other tables unchanged
});

// Migrate existing data
this.version(2).upgrade(async (tx) => {
  const solves = await tx.table("solves").toArray();
  for (const solve of solves) {
    await tx.table("solves").update(solve.id!, {
      competition: null // Default value for new field
    });
  }
});
```

### 3. Data Migration

Use the `.upgrade()` method to transform existing data:

```typescript
this.version(3).upgrade(async (tx) => {
  // Example: Convert time format
  const solves = await tx.table("solves").toArray();
  for (const solve of solves) {
    if (typeof solve.time === 'string') {
      await tx.table("solves").update(solve.id!, {
        time: parseFloat(solve.time) * 1000 // Convert to milliseconds
      });
    }
  }
});
```

## Best Practices

### ✅ Do's

- **Always increment version numbers** - Never modify existing version schemas
- **Test with real data** - Create test data in current version, then upgrade
- **Preserve user data** - Ensure all existing data is accessible after upgrade
- **Document changes** - Update this guide and release notes
- **Use transactions** - Wrap complex migrations in transactions for atomicity

### ❌ Don'ts

- **Never delete existing versions** - Users might be on any version
- **Don't remove required fields** - This breaks existing data
- **Avoid complex migrations** - Keep upgrades simple and fast
- **Don't skip version numbers** - Sequential versions help with debugging

## Testing Upgrades

1. **Create test data** in current version
2. **Implement new version** with upgrade logic
3. **Verify migration** - Check all data is preserved and accessible
4. **Test app functionality** - Ensure all features work with migrated data
5. **Performance test** - Large datasets should migrate reasonably fast

## Rollback Strategy

### Data Export/Import

Implement backup functionality:

```typescript
async exportUserData(): Promise<string> {
  const data = {
    solves: await this.solves.toArray(),
    sessions: await this.sessions.toArray(),
    personalBests: await this.personalBests.toArray(),
    userSettings: await this.userSettings.toArray(),
    cubeCaseFavorites: await this.cubeCaseFavorites.toArray(),
    algorithmStats: await this.algorithmStats.toArray(),
    exportDate: new Date().toISOString(),
    version: this.verno
  };
  return JSON.stringify(data, null, 2);
}
```

### Version Compatibility

- Maintain backwards compatibility for at least 2-3 versions
- Provide clear migration paths for major breaking changes
- Consider gradual rollouts for significant schema changes

## Common Upgrade Scenarios

### Adding Session-Specific Settings

```typescript
// Version 2: Add inspection settings to sessions
this.version(2).stores({
  sessions: "id, name, date, type, stage, caseId", // Same schema
  // ... other tables
});

this.version(2).upgrade(async (tx) => {
  const userSettings = await tx.table("userSettings").get(1);
  const sessions = await tx.table("sessions").toArray();
  
  for (const session of sessions) {
    await tx.table("sessions").update(session.id, {
      useInspection: userSettings?.useInspectionTime ?? true,
      inspectionTime: userSettings?.inspectionTime ?? 15
    });
  }
});
```

### Restructuring Data

```typescript
// Version 3: Split algorithm stats into separate table
this.version(3).stores({
  algorithmStats: "algorithmId, caseId, lastPracticed",
  algorithmTimes: "++id, algorithmId, time, date", // New table
  // ... other tables
});

this.version(3).upgrade(async (tx) => {
  const stats = await tx.table("algorithmStats").toArray();
  
  for (const stat of stats) {
    if (stat.times && stat.times.length > 0) {
      // Move times to new table
      for (const time of stat.times) {
        await tx.table("algorithmTimes").add({
          algorithmId: stat.algorithmId,
          time: time,
          date: new Date() // Approximate date
        });
      }
      
      // Remove times from stats table
      await tx.table("algorithmStats").update(stat.algorithmId, {
        times: undefined
      });
    }
  }
});
```

## Monitoring and Debugging

### Development Utilities

```typescript
// Log database state (development only)
export const debugDatabase = async () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('Database Version:', db.verno);
  console.log('Tables:', db.tables.map(t => t.name));
  // ... log table contents
};

// Reset database (development only)
export const resetDatabase = async () => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Reset only allowed in development');
  }
  await Dexie.delete("SpeedCubeDB");
  // Reinitialize...
};
```

### Error Handling

```typescript
try {
  await db.open();
} catch (error) {
  if (error.name === 'UpgradeError') {
    console.error('Database upgrade failed:', error);
    // Offer user option to reset or restore from backup
  }
}
```

## Release Checklist

Before releasing a database upgrade:

- [ ] Version number incremented
- [ ] All existing tables preserved
- [ ] Migration logic tested with real data
- [ ] Performance tested with large datasets
- [ ] Rollback plan documented
- [ ] Release notes updated
- [ ] Backup/export functionality working
- [ ] Error handling implemented

## Future Considerations

### Planned Upgrades

Document potential future schema changes:

- **Competition tracking** - Add competition results and WCA integration
- **Algorithm learning** - Track learning progress and difficulty ratings
- **Social features** - Share times and compete with friends
- **Advanced analytics** - Detailed solve analysis and trends
- **Offline sync** - Multi-device synchronization

### Breaking Changes

For major breaking changes:

1. **Deprecation period** - Warn users in advance
2. **Migration tools** - Provide automated migration utilities
3. **Data export** - Ensure users can backup their data
4. **Clear communication** - Explain benefits and migration process