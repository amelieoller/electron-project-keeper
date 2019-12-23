const os = require('os');

export const createRelativePath = folderPath => folderPath.replace(os.homedir(), '');
export const createAbsolutePath = folderPath => os.homedir() + folderPath;

export const collectIdsAndData = doc => {
  return { id: doc.id, ...doc.data() };
};

export const twoFlatArraysAreEqual = (array1, array2) => {
  // If arrays are falsy, return
  if (!array1 || !array2) return false;

  // Compare lengths (to save time)
  if (array1.length != array2.length) return false;

  // Return false if not all items are equal
  for (var i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i]) return false;
  }

  return true;
};

export const moveArrayItem = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }

  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

  return arr;
};
