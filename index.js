const { Console } = require('console');

var key = 'My Super Secret Key';

//点击导入按钮,使files触发点击事件,然后完成读取文件的操作
// $("#fileImport").click(function() {
//     $("#files").click();
// });

$("#encryptLocalFile").click(function() {
    $("#encrypt-files").click();
});

$("#decryptLocalFile").click(function() {
    $("#decrypt-files").click();
});

//Do nothing but to read files only
function fileImport() {
    //获取读取文件的File对象
    var selectedFile = document.getElementById('files').files[0];
    var name = selectedFile.name; //读取选中文件的文件名
    var size = selectedFile.size; //读取选中文件的大小
    console.log("文件名:" + name + "大小:" + size);
    var reader = new FileReader(); //这是核心,读取操作就是由它完成.
    reader.readAsText(selectedFile); //读取文件的内容,也可以读取文件的URL
    reader.onload = function() {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        console.log(this.result);

        var content = this.result;
        var blob = new Blob([content], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "read-result.txt");
    }
}


//Encrypts files using Node's built-in Cipher class.
function encryptLocalFile() {
    var selectedFile = document.getElementById('encrypt-files').files[0];
    // console.log(Object.keys(selectedFile));
    encrypt(selectedFile.path);
    console.log("encryptFile completed!");
}

var encryptor = require('./lib/file-encryptor.js'),
    fs = require('fs'),
    path = require('path');
const { OutgoingMessage } = require('http');

var encrypt = function(input) {
    encryptor.encryptFile(
        input,
        (input + '.data'),
        key,
        function(err) {
            console.log(input + ' encryption completed.');
        }
    );
};


//Decrypt local file using the same technic
function decryptLocalFile() {
    var selectedFile = document.getElementById('decrypt-files').files[0];
    let fileExtension = getFileExtension(selectedFile.path);
    console.log("&&&&" + fileExtension);
    if (fileExtension == '') {
        decrypt(selectedFile.path, selectedFile.path + '.AlexDecrypted');
    } else {
        decrypt(selectedFile.path, selectedFile.path + 'AlexDecrypted.' + fileExtension);
    }
    console.log('decryptFile completed!');
}


var decrypt = function(inputPath, outputPath) {
    encryptor.decryptFile(
        inputPath,
        outputPath,
        key,
        function(err) {
            console.log(outputPath + ' decryption complete.');
        }
    );
};

function getFileExtension(filePath) {
    if (filePath.lastIndexOf('.') == -1) {
        console.log('the file has no extension!');
        return '';
    }
    let strArr = filePath.split('.');
    return strArr[strArr.length - 1];
}

function cutFileExtension(filePath) {
    let strArr = filePath.split('.');
    let newStrArr = [];
    for (i = 0; i < strArr.length; i--) {
        newStrArr.push(strArr[i]);
    }
    let filePathWithoutExtension = newStrArr.join('');
    console.log(filePathWithoutExtension);
    return filePathWithoutExtension;
}