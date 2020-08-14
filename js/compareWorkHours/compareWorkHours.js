function workingHoursCompare() {
  let files = document.getElementById("workHoursFile").files[0];

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
  $("#compareHoursResult p").html(displayStr);
}

function loadFileName(e) {
  $("#workHoursFileName").text(e.files[0].name);
  $("#compareWorkHours").removeAttr("disabled");
}
