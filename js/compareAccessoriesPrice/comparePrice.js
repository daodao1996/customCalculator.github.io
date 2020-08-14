function accessoriesPriceCompare() {
  let files = document.getElementById("accessoriesExcelFile").files[0];

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
  $("#comparePriceResult p").html(displayStr);
}

function loadFileName(e) {
  $("#accessoriesFileName").text(e.files[0].name);
  $("#comparePrice").removeAttr("disabled");
}
