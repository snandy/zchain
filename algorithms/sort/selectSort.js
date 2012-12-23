/**
 * 选择排序
 * 
 */

function selectSort(ary) {
    var i, j, k, temp,len = ary.length
    for (i=0; i<len; i++) {
        k = i
        // 找出最小的元素索引
        for (j=i+1; j<len; j++) {
            if(ary[k] > ary[j]) {
                k = j
            }
        }
        temp = ary[i]
        ary[i] = ary[k]
        ary[k] = temp
    }
    return ary
}
// var ary = [5,4,3,2,1];
// console.log(selectSort(ary));