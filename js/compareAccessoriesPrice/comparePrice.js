function accessoriesPriceCompare() {
  let files = document.getElementById("accessoriesExcelFile").files[0];

  let fileReader = getDataFromExcelFile(comparePrice, res => {});
  fileReader.readAsBinaryString(files);
}

function comparePrice(totalData) {
  const [dataFromERP, dataFromUnderlying] = totalData;
  let compareResult = [];
  let arrayLength = 0;
  dataFromUnderlying.forEach(partsRecord => {
    let tempRes = {
      "outerPartId": partsRecord["外部物料号"],
      "outerPrice": partsRecord["销售单价"],
      "ERPInfo": []
    };
    dataFromERP.filter(erpRecord => partsRecord["外部物料号"] === erpRecord["物料编号"])
      .forEach(validRecord => {
        arrayLength++;
        tempRes.ERPInfo.push({
          "factoryId": validRecord["工厂"],
          "factoryName": validRecord["名称 1"],
          "erpPartId": validRecord["物料编号"],
          "erpPrice": validRecord["销售价格"]
        })
      });
    if(tempRes.ERPInfo.length > 0){
      compareResult.push(tempRes);
    }
  });

  formatPriceResultFile(compareResult, arrayLength);
  return compareResult;
}

function formatPriceResultFile(array, arrayLength) {
  let ranges = [{s: 'C1',e: 'F1'}, {s:'A1', e:'A2'}, {s:'B1', e:'B2'}];
  let sheetData = {
    '!ref': `A1:F${arrayLength + 1}`,
    '!merges': ranges,
    A1: {v: "外部物料号", s: { "alignment": {"vertical":"center"} }},
    B1: {v: "外部销售单价", s: { "alignment": {"vertical":"center"} }},
    C1: {v: "ERP数据", s: { "alignment": {"horizontal":"center"} }},
    D1: {v: ""},
    E1: {v: ""},
    F1: {v: ""},
    A2: {v: ""},
    B2: {v: ""},
    C2: {v: "工厂"},
    D2: {v: "工厂名称"},
    E2: {v: "物料编号"},
    F2: {v: "销售价格"}
  };
  let availableRowNum = 3;
  array.forEach(item => {
    let combineA = {s:`A${availableRowNum}`};
    let combineB = {s:`B${availableRowNum}`};
    sheetData[`A${availableRowNum}`] = {v: item["outerPartId"], t: "s", s: { "alignment": {"vertical":"center"} }};
    sheetData[`B${availableRowNum}`] = {v: item["outerPrice"], t: "n", s: { "alignment": {"vertical":"center"} }};

    item.ERPInfo.forEach(erpItem => {
      sheetData[`C${availableRowNum}`] = {v: erpItem["factoryId"], t: "s"};
      sheetData[`D${availableRowNum}`] = {v: erpItem["factoryName"], t: "s"};
      sheetData[`E${availableRowNum}`] = {v: erpItem["erpPartId"], t: "s"};
      sheetData[`F${availableRowNum}`] = {v: erpItem["erpPrice"], t: "n"};
      availableRowNum += 1;
    });

    combineA.e = `A${availableRowNum-1}`;
    combineB.e = `B${availableRowNum-1}`;
    ranges.push(combineA, combineB);
  });

  openDownloadDialog(sheet2blob(sheetData), '配件价格对比结果.xlsx');
  return sheetData;
}

function loadAccessoriesFileName(e) {
  $("#accessoriesFileName").text(e.files[0].name);
  $("#comparePrice").removeAttr("disabled");
}
