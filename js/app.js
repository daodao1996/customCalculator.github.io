function calculate() {
  let files = document.getElementById("excel-file").files[0];

  let fileReader = getDataFromExcelFile(compareStoreAndERP, displayCompareResult);
  fileReader.readAsBinaryString(files);
}

function displayCompareResult(compareResult) {
  let displayStr = "";
  compareResult.forEach(record => {
    if (record["labval_type"]) {
      Object.values(record).forEach(field => displayStr += `${field}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
      displayStr += "<br>";
    }
  });
  $("#brand p").html(displayStr);
}

function loadFileName(e) {
  $("#fileName").text(e.files[0].name);
  $("#calculate").removeAttr("disabled");
}
