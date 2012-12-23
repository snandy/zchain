/**
 * 设待排序n个元素存放在数组a[n]中,无序区范围初始为(a(0),a(1),a(2),...,a[n-1]),
 * 冒泡排序方法是在当前无序区内,从最上面的元素a[0]开始,对每两个相邻的元素a[i+1]和a[i](i=0,1,...,n-1)进行比较,
 * 且使值较小的元素换至值较大的元素之上(若a[i]&gt;a[i+1],则a[i]和a[i+1]的值互换),
 * 这样经过一趟冒泡排序后,假设最后下移的元素为a[k],
 * 则无序区中值较大的几个元素到达下端并从小到大依次存放在a[k+1],a[k+2],...a[n-1]中,
 * 这样无序区范围变为(a[0],a[1],a[2],...,a[k])。
 * 在当前无序区内进行下一趟冒泡排序。这个过程一直到某一趟排序中不出现元素交换的动作，排序结束。
 * 整个排序过程最多执行n-1遍。
 * 这种排序方法是通过相邻元素之间的比较与交换，使值较小的元素逐渐从后部移向前部（从下标较大的单元移向下标较小的单元），
 * 就象水底下的气泡一样逐渐向上冒。故称为冒泡排序法。
 */

// 由左向右移动
function bubbleSort(ary) {
	var i, temp, len = ary.length
	while (len-- >1) {
		for (i=0; i<len; i++) {
			temp = ary[i]
			if (temp>ary[i+1]) {
				ary[i] = ary[i+1]
				ary[i+1] = temp
			}
		}
	}
	return ary
}
function bubbleSort(ary) {
	var i, temp, len = ary.length
	for (; len>1; len--) {
		for (i=0; i<len; i++) {
			temp = ary[i]
			if (temp>ary[i+1]) {
				ary[i] = ary[i+1]
				ary[i+1] = temp
			}
		}
	}
	return ary
}

// 由右向左移动
function bubbleSort(ary) {
    var i, j, temp, len = ary.length
    for (var i=1; i<len; i++) {
        for (j=len-1; j>=i; j--) {
            temp = ary[j]
            if (temp < ary[j-1]) {
                ary[j] = ary[j-1]
                ary[j-1] = temp
            }
        }
    }
    return ary;
}
function bubbleSort(ary) {
	var i, temp, len = ary.length
	while (len-- > 1) {
		for (i=ary.length-1; i>0; i--) {
			temp = ary[i]
			if (temp<ary[i-1]) {
				ary[i] = ary[i-1]
				ary[i-1] = temp
			}
		}
	}
	return ary
}
var ary = [5,4,3,2,1];
console.log(bubbleSort(ary));