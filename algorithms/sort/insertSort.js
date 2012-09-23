/**
 * 直接插入排序（Straight Insertion Sorting）的基本思想是：
 * 把n个待排序的元素看成为一个有序表和一个无序表，开始时有序表中只包含一个元素，无序表中包含有n-1个元素，
 * 排序过程中每次从无序表中取出第一个元素，将它插入到有序表中的适当位置，使之成为新的有序表，重复n-1次可完成排序过程。
 * 
 */
function insertSort(ary) {
    var i, j, len = ary.length;
    var temp;
    
    for(i=1; i<len; i++) {
        temp = ary[i];
        for(j=i; j>0 && temp<ary[j-1]; j--) {
            ary[j] = ary[j-1];
        }
        ary[j] = temp;
    }
    
    return ary;
}
// var ary = [5,4,3,2,1];
// console.log(insertSort(ary));


function insertSort(ary) {
    var i, j, len = ary.length;
    var temp;
    
    for(i=1; i<len; i++) {
        temp = ary[i];
        j = i;
        while(j>0 && temp<ary[j-1]) {
            ary[j] = ary[j-1];
            j--;
        }
        ary[j] = temp;
    }
    
    return ary;
}
