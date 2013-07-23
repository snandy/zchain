/**
 * 双向链表
 * by snandy 2011
 * 
 */
LinkedList = function(){
    
function Node(data, next, prev) {
    this.data = data || null;
    this.next = next || null;
    this.prev = prev || null;
}
Node.prototype = {
    getData: function() {
        return this.data;
    },
    setData: function(data) {
        this.data = data;
    },
    getNext: function() {
        return this.next;
    },
    setNext: function(node) {
        this.next = node;
    },
    getPrev: function() {
        return this.prev;
    },
    setPrev: function(prev) {
        this.prev = prev;
    }
};
Node.prototype.constructor = Node;


function nodeByIndex(index, head) {
    var node = head;
    var i = 0;
    // 第一个
    if (index===0) {
        return node;
    }
    while (node.next) {
        if (i===index) {
            return node;
        }
        node = node.next && node.next;
        i++;
    }
    // 最后 一个
    return node;
    
}

function LinkedList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
}

LinkedList.prototype = {
    add: function(index, obj) {
        if (obj === undefined || obj === null || typeof index != 'number') {
            throw new Error('add failed, invalid param');
        }
        // 逆向取 -1，如取最后一个元素
        if (index < 0) {
            index = this.length + index;
        }
        // 空链表/索引越界
        if (index<0 || index>=this.length) {
            throw new Error('add failed, invalid index');
        }
        var newNode = new Node(obj);
        if (index==0) {
            newNode.setNext(this.head);
            this.head = newNode;
            
        } else {
            var node = nodeByIndex(index-1, this.head),
                next = node.next;
            node.setNext(newNode);
            newNode.setNext(next);
        }
        this.length++;
        
    },
    get: function(index) {
        if (typeof index !== 'number') {
            throw new Error('get failed, invalid param');
        }
        // 逆向取 -1，如取最后一个元素
        if (index < 0) {
            index = this.length + index;
        }
        // 空链表/索引越界
        if (this.isEmpty() || index<0 || index>=this.length) {
            return null;
        }
        
        var node = nodeByIndex(index, this.head);
        
        return node.value;
    },
    set: function(index, obj) {
        
        // 逆向取 -1，如取最后一个元素
        if (index < 0) {
            index = this.length + index;
        }
        // 空链表/索引越界
        if (this.isEmpty() || index<0 || index>=this.length) {
            return null;
        }
        
        var node = nodeByIndex(index, this.head);
        
        node.value = obj;
        
    },
    size: function() {
        return this.length;
    },
    clear: function() {
        this.head.next = null;
        this.head = null;
    },
    remove: function(obj) {
        var nodes = getDouble(obj, this);
        
        if (nodes === null) {
            throw new Error('remove failed, the node does not exist');
        }
        
        var curr = nodes.curr,
            prev = nodes.prev;
        
        // 删除第一个元素，注意第一个元素没有前驱
        if (prev === null) {
            this.head = curr.next;
            curr.next = null;
            curr = null;
        } else {
            prev.setNext(curr.next);
            curr.next = null;
            curr = null;
        }
        
    },
    isEmpty: function() {
        return this.head === null;
    },
    addLast: function(obj) {
        if (obj === undefined || obj === null) {
            throw new Error('push failed, invalid param');
        }
        var node = new Node(obj);
        if (!this.head) {
            this.head = this.tail = node;
        } else {
            this.tail.setNext(node);
            this.tail = node;
        }
        this.length++;
    },
    addFirst: function(obj) {
        this.add(0, obj);
    },
    contains: function(obj) {
        var node = this.head;
        if (this.isEmpty()) {
            return false;
        }
        while (node.next) {
            if(node.value == obj) {
                return true;
            }
            node = node.next;
        }
        // 第一个(length为1时)和最后一个元素
        if (node.value == obj) {
            return true;
        }
        return false;
    },
    toString: function() {
        var str = '',
            node = this.head;
            
        if (this.isEmpty()) {
            return '[]';
        }
        str = '[' + node.value;
        while (node.next) {
            node = node.next;
            str += ',' + node.value;
        }
        str += ']';
        
        return str;
    }

};

LinkedList.prototype.constructor = LinkedList;

return LinkedList;
    
}();
