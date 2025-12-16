function parse(factor) {
    let head = {
    };

    let zero;

    let current = head;
    let splitInput = input.split('\n');
    splitInput.map(Number).forEach(num => {
        current.next = {
            num: (num * factor) % (splitInput.length-1),
            originalNum: num * factor,
            prev: current
        };
        current.originalNext = current.next;
        
        current = current.next;

        if(current.num == 0) {
            zero = current;
        }
    })

    current.next = head.next;
    current.originalNext = head.next;
    head.next.prev = current;
    current = head.next;
    delete head;

    return [current, zero, splitInput.length];
}

function mix(head) {
    let current = head;
    let start = current;

    do {
        let insertBefore = current.next;
        current.next.prev = current.prev;
        current.prev.next = current.next;

        if(current.num < 0) {
            for(let i = 0; i > current.num; --i) {
                insertBefore = insertBefore.prev;
            }
        } else if (current.num > 0) {
            for(let i = 0; i < current.num; ++i) {
                insertBefore = insertBefore.next;
            }
        }

        current.next = insertBefore;
        current.prev = insertBefore.prev;
        insertBefore.prev.next = current;
        insertBefore.prev = current;

        current = current.originalNext;
    } while (current != start);
}

// it's a little convoluted but it gets the job done
function calculateCoords(zero, length) {
    let count1000 = 1000 % length;
    let count2000 = 2000 % length;
    let count3000 = 3000 % length;

    let res = 0;
    let count = 0;
    let current = zero;
    let i = 0;
    do {
        if(i == count1000 || i == count2000 || i == count3000) {
            res += current.originalNum;
            ++count;
        }

        ++i;
        current = current.next;
    } while(current != zero && count != 3);

    return res;
}

function part1() {
    let [head, zero, length] = parse(1);
    mix(head);
    return calculateCoords(zero, length);
}

function part2() {
    let [head, zero, length] = parse(811589153);
    for(let i = 0; i < 10; ++i) {
        mix(head);
    }
    return calculateCoords(zero, length);
}

const input = require("../input/2022/20.cjs");

console.log(part1());
console.log(part2());
