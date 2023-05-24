// 获取网页所有音频文件的 URL，主要用于wiki站点，F12控制台运行。
var audioElements = document.getElementsByTagName('audio');
var audioUrls = [];
for (var i = 0; i < audioElements.length; i++) {
  // 获取 <audio> 标签下所有 <source> 标签的 URL
  var sources = audioElements[i].getElementsByTagName('source');
  for (var j = 0; j < sources.length; j++) {
    audioUrls.push(sources[j].getAttribute('src'));
  }
  // 获取 <audio> 标签的 URL
  if (audioElements[i].getAttribute('src')) {
    audioUrls.push(audioElements[i].getAttribute('src'));
  }
}

// 定义已下载文件数
var numDownloaded = 0;

// 下载音频文件的函数
function downloadNextAudio() {
  // 如果已下载的文件数等于所有文件数，就表示下载已完成
  if (numDownloaded >= audioUrls.length) {
    alert('遍历完成，浏览器已经开始下载，请稍等。');
    return;
  }
  // 创建一个 XMLHttpRequest 对象
  var xhr = new XMLHttpRequest();
  // 打开一个 GET 请求，第三个参数为 true 表示使用异步请求
  xhr.open('GET', audioUrls[numDownloaded], true);
  // 设置返回类型是 blob，因为音频文件是二进制数据
  xhr.responseType = 'blob';
  // 请求完成后的回调函数
  xhr.onload = function() {
    if (xhr.status === 200) {
      // 创建一个 <a> 标签
      var a = document.createElement('a');
      // 将下载得到的 blob 数据转换成 URL 并设置给 <a> 标签的 href 属性
      a.href = window.URL.createObjectURL(xhr.response);
      // 从下载响应的 URL 中获取文件名并设置给 <a> 标签的 download 属性，这样就可以在下载时保存文件到本地
      a.download = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/') + 1);
      // 将 <a> 标签添加到 body 中，触发点击事件进行下载
      document.body.appendChild(a);
      a.click();
      // 下载完成后从 body 中移除 <a> 标签
      document.body.removeChild(a);
      // 已下载文件数增加 1
      numDownloaded++;
      // 继续下载下一个文件
      downloadNextAudio();
    }
  };
  // 发送请求
  xhr.send();
}

// 开始下载第一个音频文件
downloadNextAudio();