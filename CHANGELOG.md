# 2.0.0 (2022-10-31)

### utils

|            |                       |
| ---------- | --------------------- |
| bug fix |  support inheritance in UnRx ([98c759d8505e0160431b365a30d0122b3b2bf5a1](https://github.com/shlomiassaf/nform/commit/98c759d8505e0160431b365a30d0122b3b2bf5a1)) |

### metap

_Breaking changes:_

* The current implementation only support Array through the isArray boolean property. This does not allow Set/Map containers which is limiting the use.
The isArray property was left for legacy reasons only in TypeDefinition and will be deprecated in the future.

|            |                       |
| ---------- | --------------------- |
| bug fix |  issues in UMD bundle ([5ef41fec0c3116789dd876905eb4eabff50024c1](https://github.com/shlomiassaf/nform/commit/5ef41fec0c3116789dd876905eb4eabff50024c1)) |
| refactor |  support type containers other than array (Map/Set) ([73d8c0986a61d6cc919b9d2ccd83b840ef9e6408](https://github.com/shlomiassaf/nform/commit/73d8c0986a61d6cc919b9d2ccd83b840ef9e6408)) |

### nform

|            |                       |
| ---------- | --------------------- |
| bug fix |  error when serializing nested plain objects ([81f705dfc457a6c56e597292118a213fde327757](https://github.com/shlomiassaf/nform/commit/81f705dfc457a6c56e597292118a213fde327757)) |
| bug fix |  error when serializing nested plain objects ([8b23266b1b12dc21c81a58c399124b42ca0567ed](https://github.com/shlomiassaf/nform/commit/8b23266b1b12dc21c81a58c399124b42ca0567ed)) |


