WhereIs
===

A graphical `whereis` client.

# Install

[link to install for ios]

# Use in your own App

```javascript

// npm install co2-git/WhereIs

import WhereIs from 'WhereIs';

<WhereIs
  cmd="atom"
  onResults={(results) => {
    console.log({results});
  }}
  start
  />
```
