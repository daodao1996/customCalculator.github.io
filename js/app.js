
function calculate() {
  $("#calculate").attr("disabled","true");
  let files = document.getElementById("excel-file").files[0];
  let fileReader = new FileReader();
  fileReader.onload = function(ev) {
    try {
      var data = ev.target.result,
        workbook = XLSX.read(data, {
          type: 'binary'
        }), // 以二进制流方式读取得到整份excel表格对象
        allData = []; // 存储获取到的数据
        // console.log(workbook);
    } catch (e) {
      console.log('文件类型不正确');
      return;
    }

    // 表格的表格范围，可用于判断表头是否数量是否正确
    let fromTo = '';
    // 遍历每张表读取
    for (let sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        fromTo = workbook.Sheets[sheet]['!ref'];
        console.log(fromTo.slice(4));
        allData.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
        //break; // 如果只取第一张表，就取消注释这行
      }
    }

    // console.log(allData);
    let resultBrand = getERPExpectedAmount(allData);
    $("#brand p").html(formatString(resultBrand));
  };
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(files);
}

function loadFileName(e){
  $("#fileName").text(e.files[0].name);
  $("#calculate").removeAttr("disabled");
}
