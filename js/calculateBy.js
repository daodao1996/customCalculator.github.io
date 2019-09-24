function calculateBy(data, attribute) {
  let classification = {};
  let result = {};
  data.forEach(item => {
    let key = item[attribute];
    if(classification.hasOwnProperty(key)){
      classification[key].push(item);
    }else{
      classification[key] = [item];
    }
  });

  Object.keys(classification).forEach(key => {
    let income = 0;
    let profit = 0;
    classification[key].forEach(item => {
      income += item["收入"];
      profit += item["毛利"];
    });
    let profitMargin = ( (profit / income).toFixed(5) ) * 100;
    result[key] = profitMargin + "%";
  });

  return formatString(result);
}

function formatString(obj){
  let resultString = "";
  Object.keys(obj).forEach(key => {
     resultString += `${key}:   ${obj[key]}<br>`;
  });
  return resultString;
}