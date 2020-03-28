function get4STotalAmount(time, unit) {
  let transformedTime = time.map(item => {
    return {
      "labval_type": item.LABVAL_TYPE,
      "labval": item.LABVAL,
      "value": item.VALUE
    };
  }).splice(4);

  let transformedUnit = {};
  unit.splice(2).forEach(item => {
    transformedUnit[item.LABVAL_TYPE] = item.KBETR;
  });

  return transformedTime.map(timeItem => {
    return {
      "labval_type": timeItem["labval_type"],
      "labval": timeItem["labval"],
      "totalAmount": timeItem["value"] * transformedUnit[timeItem.labval_type],
    }
  });
}

function getERPExpectedAmount(totalData) {
  let actualAmount = get4STotalAmount(totalData[0], totalData[1]);
  let excepted = actualAmount.map(item => {
    let erpItem = totalData[2].find(erpItem => {
      if (erpItem["人工主类型"] === item["labval_type"] && erpItem["人工编号"] === item["labval"]){
        return erpItem;
      }
    });
    return {
      "labval_type": item["labval_type"],
      "labval": item["labval"],
      "totalAmount": item["totalAmount"],
      "ERPExceptedAmount": erpItem !== undefined && erpItem !== null ? erpItem["工时标准价"] : "未找到",
      "difference": erpItem !== undefined && erpItem !== null ? item["totalAmount"] - erpItem["工时标准价"] : "未找到"
    };
  });

  return formatFile(excepted);
}

function formatFile(array){
  let aoa = [["人工主类型","工时编码","店面总价","ERP总价", "差值"]];
  array.forEach(item => {
    aoa.push([item["labval_type"], item["labval"], item["totalAmount"],
      item["ERPExceptedAmount"], item["difference"]]);
  });
  var sheet = XLSX.utils.aoa_to_sheet(aoa);
  openDownloadDialog(sheet2blob(sheet), 'result.xlsx');
  return aoa;
}
