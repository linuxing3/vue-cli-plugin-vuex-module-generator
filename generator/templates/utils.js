/**
 * @计算属性
 * 返回过滤并排序后的数组items
 * @filterKey: 过滤器，用来模糊查询一个数组中的每个对象的每个字段
 *  1. 对数组items，使用filter方法，获取每一个item
 *  2. 对每一个item，使用Object.keys方法，获取键值组成的数组
 *  3. 对键值数组，使用some方法，迭代每个键名
 *  4. 对每个键名，代入到item对象，获取每个键值。
 *  5. 对每一个键值，使用indexOf方法，根据filterkey返回符合条件的数据
 *c
 * @sortKey:   用来排序的排序器
 */
export function baseFilter(items, sortKey, filterKey){
  var filter = filterKey && filterKey.toLowerCase();
  var order = 1;
  var data = items;
  if (filter) {
    data = data.filter(function(item) {
      return Object.keys(item).some(function(key) {
        return (
          String(item[key])
            .toLowerCase()
            .indexOf(filter) > -1
        );
      });
    });
  }
  if (sortKey) {
    data = data.slice().sort(function(a, b) {
      a = a[sortKey];
      b = b[sortKey];
      return (a === b ? 0 : a > b ? 1 : -1) * order;
    });
  }
  return data;
}

/**
 * Convert keys of a Object to Array to display
 * @param item Object with keys and values
 */
export function ObjectKeysToArray(item) {
  let ArrayOfKeys = Object.keys(item);
  return ArrayOfKeys;
}
