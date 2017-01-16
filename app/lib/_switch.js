import find from 'lodash/find';

export default function _switch(value, cases) {
  if (Array.isArray(cases)) {
    for (const on of cases) {
      if (on.when === value) {
        return on.then;
      }
    }
    const _default = find(cases, 'otherwise');
    if (_default) {
      return _default.otherwise;
    }
    return;
  }

  for (const key in cases) {
    if (key === value) {
      return cases[key];
    }
  }
}
