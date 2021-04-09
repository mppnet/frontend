var keys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];

function messageToBinary(message) {
    if (message.m === 'm') {
        var arr = new Uint8Array(5);
        arr[0] = 0;
        var newX = Math.round(message.x * 655.35);
        arr.set(numberToBytes(newX, 2), 1);
        var newY = Math.round(message.y * 655.35);
        arr.set(numberToBytes(newY, 2), 3);
        return arr.buffer;
    }
    if (message.m === 'n') {
        var arr = new Uint8Array(message.n.length * 3 + 7);
        arr[0] = 1;
        arr.set(numberToBytes(message.t, 6), 1);
        for (var i = 0; i < message.n.length; i++) {
            if (!keys.includes(message.n[i].n)) return;
            arr[7 + i * 3] = keys.indexOf(message.n[i].n);
            if (message.n[i].s === 1) {
                arr[7 + i * 3 + 1] = 0;
            } else {
                arr[7 + i * 3 + 1] = 1 + Math.round(Math.max(message.n[i].v, 1) * 254);
            }
            arr[7 + i * 3 + 2] = message.n[i].d || 0;
        }
        return arr.buffer;
    }
    if (message.m === 't') {
        var arr = new Uint8Array(7);
        arr[0] = 2;
        arr.set(numberToBytes(message.e, 6), 1);
        return arr.buffer;
    }
    return;
}
function messageFromBinary(message) {
    if (typeof message === 'string') return message;
    var arr = new Uint8Array(message);
    if (arr[0] === 0) {
        var msg = {};
        msg.m = 'm';
        msg.x = bytesToNumber(arr.slice(1, 3)) / 655.35;
        msg.y = bytesToNumber(arr.slice(3, 5)) / 655.35;
        msg.id = bytesToId(arr.slice(5, 18));
        return msg;
    }
    if (arr[0] === 1) {
        var msg = {};
        msg.m = 'n';
        msg.t = bytesToNumber(arr.slice(1, 7));
        msg.p = bytesToId(arr.slice(7, 20));
        msg.n = [];
        for (var i = 0; i < (arr.length - 19) / 3; i++) {
            var note = {};
            note.n = keys[arr[19 + i * 3]];
            if (arr[19 + i * 3 + 1] === 0) {
                note.s = 1;
            } else {
                note.v = (arr[19 + i * 3 + 1] - 1) / 254;
            }
            note.d = arr[19 + i * 3 + 2];
            msg.n.push(note);
        }
        return msg;
    }
    if (arr[0] === 2) {
        var msg = {};
        msg.m = 't';
        msg.e = bytesToNumber(arr.slice(1, 7));
        msg.t = bytesToNumber(arr.slice(7, 13));
        return msg;
    }
    return;
}

window.messageToBinary = messageToBinary;
window.messageFromBinary = messageFromBinary;

function numberToBytes(number, length) {
    var byteArray = new Uint8Array(length);
    for (var index = 0; index < byteArray.length; index ++ ) {
        var byte = number & 0xff;
        byteArray[index] = byte;
        number = (number - byte) / 256;
    }
    return byteArray;
}
function bytesToNumber(bytes) {
    var value = 0;
    for (var i = bytes.length - 1; i >= 0; i--) {
        value = (value * 256) + bytes[i];
    }
    return value;
}
function idToBytes(id) {
    var byteArray = new Uint8Array(12);
    for (var i = 0; i < 12; i++) {
        byteArray[i] = parseInt(id.substring(i * 2, i * 2 + 2), 16);
    }
    return byteArray;
}
function bytesToId(bytes) {
    var string = '';
    for (var i = 0; i < 12; i++) {
        var byte = bytes[i].toString(16);
        string += byte.length === 2 ? byte : '0' + byte;
    }
    return string;
}

//message numbers
//0 - m
//1 - n
//2 - t
