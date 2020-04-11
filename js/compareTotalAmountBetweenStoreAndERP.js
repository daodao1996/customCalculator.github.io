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

  return formatFile(exceptedResult);
}

function formatFile(array) {
  let aoa = [["人工主类型", "工时编码", "店面总价", "ERP总价", "差值"]];
  array.forEach(item => {
    aoa.push([item["labval_type"], item["labval"], item["totalAmount"],
      item["ERPExceptedAmount"], item["difference"]]);
  });
  var sheet = XLSX.utils.aoa_to_sheet(aoa);
  openDownloadDialog(sheet2blob(sheet), 'result.xlsx');
  return aoa;
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
