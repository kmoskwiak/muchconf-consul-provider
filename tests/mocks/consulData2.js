/**
 * Updating
 */
let db1 = [ 
  { LockIndex: 0,
    Key: 'muchconf/',
    Flags: 0,
    Value: null,
    CreateIndex: 805,
    ModifyIndex: 805 },
  { LockIndex: 0,
    Key: 'muchconf/dir/',
    Flags: 0,
    Value: null,
    CreateIndex: 1843,
    ModifyIndex: 1843 },
  { LockIndex: 0,
    Key: 'muchconf/dir/p3',
    Flags: 0,
    Value: '3',
    CreateIndex: 1844,
    ModifyIndex: 1844 },
  { LockIndex: 0,
    Key: 'muchconf/p1',
    Flags: 0,
    Value: '1',
    CreateIndex: 808,
    ModifyIndex: 808 },
  { LockIndex: 0,
    Key: 'muchconf/p2',
    Flags: 0,
    Value: 'dwa',
    CreateIndex: 809,
    ModifyIndex: 809 } 
];

let db2 = [ 
  { LockIndex: 0,
    Key: 'muchconf/',
    Flags: 0,
    Value: null,
    CreateIndex: 805,
    ModifyIndex: 855 },
  { LockIndex: 0,
    Key: 'muchconf/dir/',
    Flags: 0,
    Value: null,
    CreateIndex: 1843,
    ModifyIndex: 1943 },
  { LockIndex: 0,
    Key: 'muchconf/dir/p3',
    Flags: 0,
    Value: '4',
    CreateIndex: 1844,
    ModifyIndex: 1944 },
  { LockIndex: 0,
    Key: 'muchconf/p1',
    Flags: 0,
    Value: '5',
    CreateIndex: 808,
    ModifyIndex: 858 },
  { LockIndex: 0,
    Key: 'muchconf/p2',
    Flags: 0,
    Value: 'dwa',
    CreateIndex: 809,
    ModifyIndex: 889 } 
];

 const data = {
  first: true,
  get data() {
    if(this.first) {
      this.first = false;
      return db1;
    } else {
      return db2;
    }
  }
 };



  
  module.exports = data;