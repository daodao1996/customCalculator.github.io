function get4SStoreTotalAmount(time, unit) {
  let transformedTime = getWorkTime(time);

  let transformedUnit = getUnitPriceObject(unit);

  return transformedTime.map(timeItem => {
    if (transformedUnit.hasOwnProperty(timeItem.labval_type)) {
      timeItem["totalAmount"] = Math.round(timeItem["value"] * transformedUnit[timeItem.labval_type] * 1000000) / 1000000;
    } else {
      timeItem["totalAmount"] = "人工主类型缺失";
    }
    return timeItem;
  });
}

function compareStoreAndERP(totalData) {
  let actualAmount = get4SStoreTotalAmount(totalData[0], totalData[1]);

  let exceptedResult = actualAmount.map(originalItem => {
    if (originalItem.totalAmount === "人工主类型缺失") {
      originalItem["ERPExceptedAmount"] = "人工主类型缺失";
      originalItem["difference"] = "人工主类型缺失";
    } else {
      let erpRecord = totalData[2].find(erpItem => isMatch(erpItem, originalItem));

      if (!erpRecord) {
        originalItem["ERPExceptedAmount"] = "未发现";
        originalItem["difference"] = "未发现";
      } else {
        originalItem["ERPExceptedAmount"] = !erpRecord["工时标准价"] ? "ERP无价格" : parseFloat(erpRecord["工时标准价"]);
        originalItem["difference"] = !erpRecord["工时标准价"] ? "ERP无价格" : originalItem["totalAmount"] - parseFloat(erpRecord["工时标准价"]);
      }

    }
    return originalItem;
  });

  formatFile(exceptedResult);
  return exceptedResult;
}

function formatFile(array) {
  let sheetData = {
    '!ref': `A1:E${array.length + 1}`,
    A1: {v: "人工主类型"},
    B1: {v: "工时编码"},
    C1: {v: "店面总价"},
    D1: {v: "ERP总价"},
    E1: {v: "差值"}
  };
  array.forEach((item, index) => {
    if(item["labval_type"] && item["labval"]){
      sheetData[`A${index+2}`] = {v: item["labval_type"],t: "s"};
      sheetData[`B${index+2}`] = {v: item["labval"],t: "s"};
      sheetData[`C${index+2}`] = {v: item["totalAmount"], t: "n"};
      sheetData[`D${index+2}`] = {v: item["ERPExceptedAmount"], t: "n"};
      sheetData[`E${index+2}`] = {v: item["difference"], t: "n"};
    }
  });

  openDownloadDialog(sheet2blob(sheetData), 'result.xlsx');
  return sheetData;
}

function isMatch(erpItem, originalItem) {
  return erpItem["人工主类型"] === originalItem["labval_type"] && erpItem["人工编号"] === originalItem["labval"];
}

function getWorkTime(time) {
  return time.splice(4).map(item => {
    return {
      "labval_type": item.LABVAL_TYPE,
      "labval": item.LABVAL,
      "value": item.VALUE
    };
  });
}

function getUnitPriceObject(unit) {
  let transformedUnit = {};
  unit.splice(2).forEach(item => {
    transformedUnit[item.LABVAL_TYPE] = item.KBETR;
  });
  return transformedUnit;
}
